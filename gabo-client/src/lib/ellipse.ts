/*
n = number of divs,
rx = radius along X-axis,
ry = radius along Y-axis,
so = startOffset,
cw = clockwise(true/false)
*/
export function ellipse(n: number, rx: number, ry: number, so: number = 0, cw: boolean = true): { top: string, left: string }[] {
  const ret = [];
  for (let i = 0; i < n; i++) {
    const top = ry + -ry * Math.cos((360 / n / 180) * (i + so) * Math.PI + Math.PI);
    const left = rx + rx * (cw ? Math.sin((360 / n / 180) * (i + so) * Math.PI) : -Math.sin((360 / n / 180) * (i + so) * Math.PI + Math.PI));
    ret.push({ top: top.toString() + "px", left: left.toString() + "px" });
  }
  return ret;
}