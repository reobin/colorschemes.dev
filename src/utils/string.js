import EmojiConvertor from 'emoji-js';

const emoji = new EmojiConvertor();
emoji.replace_mode = 'unified';

export const URLify = value =>
  !!value ? value.trim().replace(/\s/g, "%20").toLowerCase() : "";

export const parseStringWithEmoji = string => emoji.replace_colons(string);
