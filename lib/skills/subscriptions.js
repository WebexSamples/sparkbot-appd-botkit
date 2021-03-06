module.exports = function(controller) {

    controller.hears(['^sub'], 'direct_message,direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {

            function subscribeToNotification(type, space) {
                controller.storage.subscriptions.get(type, function(err, subscription_data) {
                    var spaces = [];
                    if (subscription_data) {
                        spaces = subscription_data.spaces;
                        if (!users.includes(user)) {
                            spaces.push(space);
                            convo.say("You're now subscribed to '{}' notifications.".format(type));
                        } else {
                            convo.say("You're already subscribed to '{}' notifications.".format(type));
                        }
                    } else {
                        spaces.push(space);
                        convo.say("You're now subscribed to '{}' notifications.".format(type));
                    }
                    controller.storage.subscriptions.save({ id: type, spaces: spaces }, function(err) {});
                });
            }

            convo.ask("What type of notifications do you want to subscribe to? (INFO/WARN/ERROR)", [{
                pattern: "INFO|info|Info",
                callback: function(response, convo) {
                    subscribeToNotification('info', message.original_message.roomId);
                    convo.next();
                },
            }, {
                pattern: "WARN|warn|Warn",
                callback: function(response, convo) {
                    subscribeToNotification('warn', message.original_message.roomId);
                    convo.next();
                },
            }, {
                pattern: "ERROR|error|Error",
                callback: function(response, convo) {
                    subscribeToNotification('error', message.original_message.roomId);
                    convo.next();
                },
            }, {
                default: true,
                callback: function(response, convo) {
                    convo.say("Sorry, I did not understand.");
                    convo.repeat();
                    convo.next();
                }
            }]);

            convo.activate();
        });
    });

    controller.hears(['^unsub'], 'direct_message,direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {

            function unsubscribeFromNotification(type, space) {
                controller.storage.subscriptions.get(type, function(err, subscription_data) {
                    if (subscription_data) {
                        spaces = subscription_data.spaces;
                        if (spaces.includes(space)) {
                            spaces.splice(spaces.indexOf(space), 1);
                            convo.say("You're now unsubscribed from '{}' notifications.".format(type));
                        } else {
                            convo.say("You're not currently subscribed to '{}' notifications.".format(type));
                        }
                    } else {
                        convo.say("You're not currently subscribed to '{}' notifications.".format(type));
                    }
                    controller.storage.subscriptions.save({ id: type, spaces: spaces }, function(err) {});
                });
            }
            convo.ask("What type of notifications do you want to unsubscribe from? (INFO/WARN/ERROR)", [{
                pattern: "INFO|info|Info",
                callback: function(response, convo) {
                    unsubscribeFromNotification('info', message.original_message.roomId);
                    convo.next();
                },
            }, {
                pattern: "WARN|warn|Warn",
                callback: function(response, convo) {
                    unsubscribeFromNotification('warn', message.original_message.roomId);
                    convo.next();
                },
            }, {
                pattern: "ERROR|error|Error",
                callback: function(response, convo) {
                    unsubscribeFromNotification('error', message.original_message.roomId);
                    convo.next();
                },
            }, {
                default: true,
                callback: function(response, convo) {
                    convo.say("Sorry, I did not understand.");
                    convo.repeat();
                    convo.next();
                }
            }]);

            convo.activate();
        });
    });

    controller.hears(['^show sub'], 'direct_message,direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {

            controller.storage.subscriptions.all(function(err, subscription_data) {
                if (subscription_data) {
                    var list = "";
                    subscription_data.forEach(function(sub) {
                        sub.spaces.forEach(function(space) {
                            if (message.original_message.roomId == space) {
                                list += "`{}`<br/>".format(sub.id);
                            }
                        });
                    });
                    if (list == "") {
                        convo.say("You don't have any active subscriptions.");
                    } else {
                        convo.say("You're currently subscribed to the following notifications:<br/>" + list);
                    }
                }
            });

            convo.activate();
        });
    });


};