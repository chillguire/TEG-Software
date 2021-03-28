module.exports.render = (req, res) => {
    res.render('chats/chat', { currentUser: res.locals.currentUser });
}