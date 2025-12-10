/**
 * Detects social media crawler bots by User-Agent
 */

const SOCIAL_MEDIA_BOTS = [
  // WhatsApp
  "WhatsApp",
  // Facebook
  "facebookexternalhit",
  "Facebot",
  // Twitter/X
  "Twitterbot",
  // LinkedIn
  "LinkedInBot",
  // Telegram
  "TelegramBot",
  // Slack
  "Slackbot-LinkExpanding",
  "Slackbot",
  // Discord
  "Discordbot",
  // Pinterest
  "Pinterest",
  // Skype
  "SkypeUriPreview",
  // iMessage
  "Applebot",
  // Google (for rich snippets)
  "Googlebot",
];

/**
 * Check if the User-Agent belongs to a social media crawler bot
 * @param userAgent - The User-Agent header string
 * @returns true if the request is from a social media bot
 */
export function isSocialMediaBot(userAgent: string | undefined): boolean {
  if (!userAgent) return false;

  return SOCIAL_MEDIA_BOTS.some((bot) =>
    userAgent.toLowerCase().includes(bot.toLowerCase())
  );
}
