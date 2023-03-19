const { Configuration, OpenAIApi } = require("openai");

class Translator {
  #openai;
  #promptTitle = 'Translate this text into Russian:';

  constructor(apiKey) {
    const config = new Configuration({ apiKey });
    this.#openai = new OpenAIApi(config);
  }

  async getTranslation(prompt) {
    const fullPrompt = this.#promptTitle + prompt;
    try {
      const response = await this.#createCompletion(fullPrompt);
      return response;
    } catch (err) {
      console.error(err);
    }
  }

  async #createCompletion(prompt) {
    const response = await this.#openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.3,
      max_tokens: 2048,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    return response.data.choices[ 0 ].text;
  }
}

module.exports = Translator;