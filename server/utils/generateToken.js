const jwt = require('jsonwebtoken');

// ─── Generate JWT Token ───────────────────────────────────────
// A JWT (JSON Web Token) is like a digital ID card.
// It contains the user's ID and is signed with a secret key.
// The frontend stores this token and sends it with every protected request.
//
// Structure of a JWT:  HEADER.PAYLOAD.SIGNATURE
// Example: eyJhbGci...eyJ1c2VyS...SflKxw...
//
// Parameters:
//   id  — the MongoDB _id of the user
// Returns:
//   A signed JWT string that expires in 30 days

const generateToken = (id) => {
  return jwt.sign(
    { id },                          // Payload: what to store inside the token
    process.env.JWT_SECRET,          // Secret key used to sign the token
    { expiresIn: '30d' }             // Token expires after 30 days
  );
};

module.exports = generateToken;
