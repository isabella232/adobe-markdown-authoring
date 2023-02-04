import StateCore from "markdown-it/lib/rules_core/state_core";
import Token from "markdown-it/lib/token";
import { TokenType } from "..";

export default function transformLinkTargets(state: StateCore) {
  let linkTokens: Token[] = state.tokens;
  const targetMatch = /\[([^\]]*)\]\(([^\)]*)\)\{\s*target\s*=\s*([^\}]*)\}/; // [text](url){target=foo}

  for (var i = 0, l = linkTokens.length; i < l; i++) {
    let token = linkTokens[i];
    if (token.type === TokenType.INLINE && token.content.match(targetMatch)) {
      const linkLine = linkTokens[i].content;
      if (linkLine) {
        // Convert the linkToken token to an HTML_BLOCK token
        const ids = linkLine.match(targetMatch);
        const [_, text, url, target] = ids;
        //   const htmlToken = new Token("html_block", "", 0);
        //   htmlToken.content = `<a href="${url}" target="${target}" title="${text}">${text}</a>`;
        //   linkTokens.splice(i, 1, htmlToken); // replace the inline token with the link_open token
        const linkToken = new Token("link_open", "a", 1);
        linkToken.attrs = [
          ["href", url],
          ["target", target],
        ];
        linkToken.content = text;
        linkTokens.splice(i, 1, linkToken); // replace the inline token with the link_open token
        const textToken = new Token("text", "", 0);
        textToken.content = text;
        linkTokens.splice(i + 1, 0, textToken); // insert the text token
        const linkCloseToken = new Token("link_close", "a", -1);
        linkTokens.splice(i + 2, 0, linkCloseToken); // insert the link_close token
      }
    }
  }
}
