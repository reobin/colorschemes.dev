import EmojiConverter from "emoji-js";

const emojiConverter = new EmojiConverter();

// Force convert mode to unicode
emojiConverter.replace_mode = "unified";

export const convertColonEmojis = value => emojiConverter.replace_colons(value);
