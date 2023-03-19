/*
  Just as an example. Check and refactor in case of using.

  see: https://www.twilio.com/blog/manipulate-notion-database-using-node-js
*/

const Client = require('@notionhq/client').Client;

async function addToDatabase(notion, databaseId, title, translation) {
  try {
      const response = await notion.pages.create({
          parent: {
              database_id: databaseId,
          },
          properties: {
              'Title': {
                  type: 'title',
                  title: [
                  {
                      type: 'text',
                      text: {
                          content: title,
                      },
                  },
                  ],
              },
              'Translation' : {
                      type: 'rich_text',
                      rich_text: [
                      {
                          type: 'text',
                          text: {
                              content: translation,
                          },
                      }
                      ],
              }
          }    
      });

      return response;
  } catch (error) {
      console.error(error.body);
  }
}

async function queryDatabase(databaseId, username) {
  try {
      const response = await notion.databases.query({
          database_id: databaseId,
          "filter": {
              "property": "ID",
              "rich_text": {
                  "contains": username
              }
          }
        });  
      return response.results[0].id;
  } catch (error){
      console.log(error.body);
  }
}

const sendResult = async (translation) => {
  const notionClient = new Client({ auth: process.env.NOTION_KEY });
  const title = 'New title';
  try {
    const response = await addToDatabase(notionClient, process.env.NOTION_DATABASE_ID, title, translation);
  return response;
  } catch (error) {
    console.error(error);
  }
};