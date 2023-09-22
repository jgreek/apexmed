import json
import openai
from pathlib import Path


class OpenAIChat:

    def __init__(self, configuration_directory):
        self.assets_directory = Path(configuration_directory)
        self.config_file = self.assets_directory / "config.json"
        self.api_key = self.get_api_key()
        openai.api_key = self.api_key

    def get_api_key(self):
        if not self.config_file.exists():
            # Create a file with a sample API key
            with open(self.config_file, 'w') as f:
                sample_key_data = {"api_key": "OPENAI_API_KEY_HERE"}
                json.dump(sample_key_data, f)
            raise ValueError(
                f"API key not found! Sample config file created at {self.config_file}. Please update it with your API key.")

        with open(self.config_file, 'r') as f:
            config_data = json.load(f)
            return config_data["api_key"]

    def chat(self, messages, model="gpt-3.5-turbo"):
        return openai.ChatCompletion.create(model=model, messages=messages)


# Usage:
if __name__ == "__main__":
    assets_directory = Path("../data/assets")
    assets_directory.mkdir(parents=True, exist_ok=True)
    chatbot = OpenAIChat(assets_directory)
    response = chatbot.chat([
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who won the world series in 2020?"}
    ])
    print(response['choices'][0]['message']['content'])
