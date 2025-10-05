function sanitizeUser(user) {
  if (!user) return null;
  const {
    password,
    ...safe
  } = user;
  return safe;
}

function sanitizeUsers(users) {
  if (!Array.isArray(users)) return sanitizeUser(users);
  return users.map(u => sanitizeUser(u));
}

module.exports = { sanitizeUser, sanitizeUsers };