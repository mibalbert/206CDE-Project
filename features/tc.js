module.exports = function(controller) {
  
  //Setup conversation
  const { BotkitConversation } = require('botkit');
  const DIALOG_ID_TC = 'test_dialog';
  let tc_convo = new BotkitConversation(DIALOG_ID_TC, controller);
  
  //Initial thread, fires when user greets the bot
  tc_convo.say('Hi, my name is Tim!');

  //Ask user if they want to know more about T&C
  tc_convo.addQuestion('Would you like to know more about T\&C?', [
   {
       pattern: 'yes',
       type: 'string',
       handler: async(response_text, tc_convo, bot, full_message) => {
           return await tc_convo.gotoThread('questions_regarding_tc');
       }
   },
   {
       pattern: 'no',
       type: 'string',
       handler: async(response_text, tc_convo, bot, full_message) => {
           return await tc_convo.gotoThread('no_help');
       }
    },
    {
        default: true,
        handler: async(response_text, tc_convo, bot, full_message) => {
            await bot.say('I do not understand your response!');
            // start over!
            return await tc_convo.repeat();
        }
    }
  ], 'initial_questions');


  //tc_convo.addMessage('Fantastic! \n Here\'s how I can help', 'questions_regarding_tc')
  tc_convo.addMessage({
    text:'Fantastic! \n Here\'s how I can help',
    quick_replies:[
      {
        title:'Analyse document',
        payload:'Analyse document',
      },
      {
        title:'Create T&C',
        payload:'Create T&C',
      },
      {
        title:'Common hidden clauses',
        payload:'Common hidden clauses',
      },
      {
        title:'Contact us',
        payload:'Contact us',
      }
    ]},'questions_regarding_tc' )
  tc_convo.addMessage('Thanks for using our bot', 'no_help')
  tc_convo.addMessage('I cannot help you', 'cannot_help')
  
      controller.hears('Analyse document','message', async(bot, message) => {
        await bot.reply(message, 'You can send us your T&C document at parosa@uni.coventry.ac.uk');
    });
            controller.hears('Create T&C','message', async(bot, message) => {
        await bot.reply(message, 'You can create your own T&C at www.termsandconditionsgenerator.com');
    });
              controller.hears('Common hidden clauses','message', async(bot, message) => {
        await bot.reply(message, 'placeholder3');
    });
              controller.hears('Contact us','message', async(bot, message) => {
        await bot.reply(message, 'placeholder4');
    });
  
  tc_convo.addMessage('You can send us your T&C document at parosa@uni.coventry.ac.uk', 'reply_1')
  tc_convo.addMessage('You can create your own T&C at www.termsandconditionsgenerator.com', 'reply_2')
  tc_convo.addMessage('placeholder3', 'reply_3')
  tc_convo.addMessage('placeholder4', 'reply_4')
  
  
  tc_convo.addQuestion('Would you like to repeat this chat?', [
   {
       pattern: 'yes',
       type: 'string',
       handler: async(response_text, tc_convo, bot, full_message) => {
           return await tc_convo.repeat()
       }
   },
   {
       pattern: 'no',
       type: 'string',
       handler: async(response_text, tc_convo, bot, full_message) => {
           return await tc_convo.gotoThread('end_loop');
       }
    },
    {
        default: true,
        handler: async(response_text, tc_convo, bot, full_message) => {
            await bot.say('I do not understand your response!');
            // start over!
            return await tc_convo.repeat();
        }
    }
  ], 'end_questions');
  
  tc_convo.addMessage({
    text: 'Have you found this bot useful?',
    quick_replies:[
      {
        title:'Yes',
        payload:'Yes, this was useful',
      },
      {
        title:'No',
        payload:'No, this was not useful',
      }
    ]
  }, 'end_loop')
  
    controller.hears('end','message', async(bot, message, tc_convo) => {
        return await tc_convo.addAction('end_questions')
    });
  
  
  
  tc_convo.addAction('end_questions')
  
  
  //Add dialog to controller so we can intialize
  controller.addDialog(tc_convo);
  
  //Begin dialog
  controller.hears(['hi', 'hello'], ['message'], async(bot, message) => {
    await bot.beginDialog(DIALOG_ID_TC)
  });
  
  //Exit dialog on common keywords
  controller.hears(['quit', 'stop', 'exit'], ['message'], async(bot, message) => {
    await bot.reply(message, 'Exiting all dialogs')
    await bot.cancelAllDialogs()
  })

}
