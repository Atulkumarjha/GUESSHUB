export function cost(qYes: number, qNo: number, b: number) {
  return b * Math.log(Math.exp(qYes / b) + Math.exp(qNo / b));
}

export function lmsrBuy(
  qYes: number,
  qNo: number,
  outcome: "YES" | "NO",
  shares: number,
  b: number
) {
  const c0 = cost(qYes, qNo, b);

  if (outcome === "YES") qYes += shares;
  else qNo += shares;

  const c1 = cost(qYes, qNo, b);

  const costToBuy = c1 - c0;

  return { costToBuy, newQYes: qYes, newQNo: qNo };
}

export function price(qYes: number, qNo: number, b: number) {
  const eYes = Math.exp(qYes / b);
  const eNo = Math.exp(qNo / b);
  return {
    yes: eYes / (eYes + eNo),
    no: eNo / (eYes + eNo),
  };
}
