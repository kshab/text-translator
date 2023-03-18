const { Configuration, OpenAIApi } = require("openai");

class Translator {
  #openai;
  #promptTitle = 'Translate this text into Russian:\n\n';

  constructor(apiKey) {
    const config = new Configuration({ apiKey });
    this.#openai = new OpenAIApi(config);
  }

  async getTranslation(paragraphs) {
    const translatedParagraphs = [];

    for (const p of paragraphs) {
      const prompt = this.#promptTitle + p;
      const response = await this.#createCompletion(prompt);
      translatedParagraphs.push(response);
    }

    const translation = translatedParagraphs.join();

    return await translation;
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