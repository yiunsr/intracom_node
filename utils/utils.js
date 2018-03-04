
module.exports.isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};


module.exports.isAdmin = function (req, res, next) {
  if (!req.isAuthenticated())
    res.redirect('/login');
  if (req.user.usertype !="admin")
    res.redirect('/login');
  return next();

};
