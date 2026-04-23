"""Trace the handwritten signature PNG into an SVG of centerline paths.

Input : static/images/signature/kevin-signature-clean.png
Output: src/lib/assets/kevin-signature.svg

The PNG is already isolated to white strokes on a transparent background.
We binarize its alpha channel, skeletonize to one-pixel-wide centerlines,
then walk the skeleton into a collection of contiguous polylines (splitting
at junction pixels, which tend to be noisy and break cleanly between loops).
Each polyline becomes an SVG path with `pathLength="1"` so the frontend can
animate `stroke-dashoffset` from 1 to 0 uniformly across all segments.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image
from skimage.morphology import skeletonize

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
SRC = ROOT / "static" / "images" / "signature" / "kevin-signature-clean.png"
DST = ROOT / "src" / "lib" / "assets" / "kevin-signature.svg"


def neighbors(x: int, y: int, w: int, h: int):
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dx == 0 and dy == 0:
                continue
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h:
                yield nx, ny


def walk(start: tuple[int, int], skel: np.ndarray, visited: np.ndarray, stop_at_junctions: bool):
    """Walk along single-file skeleton pixels from `start`.

    Returns the ordered list of (x, y) pixels visited. Stops when:
    - we hit an already-visited pixel, OR
    - we reach a junction (if stop_at_junctions), OR
    - we reach a dead end.
    """
    h, w = skel.shape
    path = [start]
    visited[start[1], start[0]] = True
    cur = start
    while True:
        cx, cy = cur
        candidates = [
            (nx, ny)
            for nx, ny in neighbors(cx, cy, w, h)
            if skel[ny, nx] and not visited[ny, nx]
        ]
        if not candidates:
            break
        # Prefer orthogonal neighbors over diagonal for smoother paths.
        candidates.sort(key=lambda p: abs(p[0] - cx) + abs(p[1] - cy))
        nxt = candidates[0]
        # Count neighbors of the *next* pixel in the skeleton to detect junctions.
        deg = sum(1 for mx, my in neighbors(nxt[0], nxt[1], w, h) if skel[my, mx])
        path.append(nxt)
        visited[nxt[1], nxt[0]] = True
        if stop_at_junctions and deg > 2:
            break
        cur = nxt
    return path


def trace_skeleton(skel: np.ndarray) -> list[list[tuple[int, int]]]:
    h, w = skel.shape

    # Pre-compute degree (number of skeleton neighbors) for each skeleton pixel.
    deg = np.zeros_like(skel, dtype=np.int8)
    ys, xs = np.nonzero(skel)
    for x, y in zip(xs, ys):
        deg[y, x] = sum(1 for nx, ny in neighbors(x, y, w, h) if skel[ny, nx])

    visited = np.zeros_like(skel, dtype=bool)
    paths: list[list[tuple[int, int]]] = []

    # Pass 1: start from endpoints (degree 1) and trace until junction or dead-end.
    endpoints = [(int(x), int(y)) for x, y in zip(xs, ys) if deg[y, x] == 1]
    for ep in endpoints:
        if visited[ep[1], ep[0]]:
            continue
        path = walk(ep, skel, visited, stop_at_junctions=True)
        if len(path) >= 2:
            paths.append(path)

    # Pass 2: handle junction pixels — each unvisited branch out of a junction
    # becomes its own path. Re-use the junction pixel as starting anchor.
    junctions = [(int(x), int(y)) for x, y in zip(xs, ys) if deg[y, x] >= 3]
    for jx, jy in junctions:
        # For each unvisited neighbor, start a sub-path anchored at the junction.
        for nx, ny in neighbors(jx, jy, w, h):
            if skel[ny, nx] and not visited[ny, nx]:
                # Anchor by including the junction pixel for visual continuity,
                # without marking it visited (may belong to other branches).
                visited[ny, nx] = True
                path = [(jx, jy), (nx, ny)]
                # Continue walking from the neighbor.
                cur = (nx, ny)
                while True:
                    cx, cy = cur
                    cands = [
                        (cx2, cy2)
                        for cx2, cy2 in neighbors(cx, cy, w, h)
                        if skel[cy2, cx2] and not visited[cy2, cx2]
                    ]
                    if not cands:
                        break
                    cands.sort(key=lambda p: abs(p[0] - cx) + abs(p[1] - cy))
                    nxt = cands[0]
                    d = sum(
                        1 for mx, my in neighbors(nxt[0], nxt[1], w, h) if skel[my, mx]
                    )
                    path.append(nxt)
                    visited[nxt[1], nxt[0]] = True
                    if d > 2:
                        break
                    cur = nxt
                if len(path) >= 2:
                    paths.append(path)

    # Pass 3: any remaining unvisited skeleton pixels belong to closed loops
    # (every pixel has degree 2). Start anywhere and walk until we come back.
    for x, y in zip(xs, ys):
        if visited[y, x]:
            continue
        path = walk((int(x), int(y)), skel, visited, stop_at_junctions=False)
        if len(path) >= 2:
            paths.append(path)

    return paths


def simplify(path: list[tuple[int, int]], tol: float = 0.7) -> list[tuple[int, int]]:
    """Ramer-Douglas-Peucker to trim redundant collinear points."""
    if len(path) <= 2:
        return path

    def rdp(pts):
        if len(pts) <= 2:
            return pts
        x0, y0 = pts[0]
        x1, y1 = pts[-1]
        dx, dy = x1 - x0, y1 - y0
        denom = (dx * dx + dy * dy) ** 0.5 or 1.0
        max_d = 0.0
        idx = 0
        for i in range(1, len(pts) - 1):
            px, py = pts[i]
            d = abs(dy * px - dx * py + x1 * y0 - y1 * x0) / denom
            if d > max_d:
                max_d = d
                idx = i
        if max_d > tol:
            left = rdp(pts[: idx + 1])
            right = rdp(pts[idx:])
            return left[:-1] + right
        return [pts[0], pts[-1]]

    return rdp(path)


def main() -> None:
    img = Image.open(SRC).convert("RGBA")
    alpha = np.array(img)[:, :, 3]
    mask = alpha > 127
    h, w = mask.shape

    skel = skeletonize(mask)
    raw_paths = trace_skeleton(skel)
    paths = [simplify(p, tol=0.8) for p in raw_paths if len(p) >= 3]

    # Sort by leftmost x so the animation progresses left → right.
    paths.sort(key=lambda p: min(pt[0] for pt in p))

    # Build SVG.
    view_w, view_h = w, h
    segments_svg = []
    for i, path in enumerate(paths):
        d = "M " + " L ".join(f"{x} {y}" for x, y in path)
        segments_svg.append(
            f'  <path d="{d}" pathLength="1" data-order="{i}" style="--i: {i};" />'
        )

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {view_w} {view_h}" '
        f'fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" '
        f'stroke-linejoin="round">\n'
        + "\n".join(segments_svg)
        + "\n</svg>\n"
    )

    DST.write_text(svg, encoding="utf-8")
    print(f"wrote {DST} — {len(paths)} paths, viewBox {view_w}x{view_h}")


if __name__ == "__main__":
    main()
