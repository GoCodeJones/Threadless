const trusts = {
  'threadless-local': 1.0
};

function getTrust(connectionId) {
  return trusts[connectionId] ?? 0.3;
}

function setTrust(connectionId, value) {
  trusts[connectionId] = Math.max(0, Math.min(1, value));
}

module.exports = {
  getTrust,
  setTrust
};
