const regDict = {
  UV: /(?<UV>[A-Z0-9]+)/,
};

function joinReg(...regs: RegExp[]) {
  return regs.reduce(
    (acc, reg) =>
      new RegExp(
        acc.source + reg.source,
        (acc.flags + reg.flags).replace(/(.)(?=.*\1)/g, "")
      )
  );
}

const reg = joinReg(/(?<UV>[A-Z0-9]+)/, regDict["UV"], /(?<UV>[A-Z0-9]+)/);

export function gen(input: string) {}
