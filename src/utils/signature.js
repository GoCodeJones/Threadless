const crypto = require('crypto');

function signPayload(payload, secret) {
  const json = JSON.stringify(payload);
  return crypto
    .createHmac('sha256', secret)
    .update(json)
    .digest('hex');
}

function verifySignature(payload, signature, secret) {
  const expected = signPayload(payload, secret);
  return expected === signature;
}

module.exports = {
  signPayload,
  verifySignature
};
