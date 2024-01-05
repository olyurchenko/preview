import {Mention} from './app.component';
import Quill from 'quill'

const MentionBlot = Quill.import("blots/mention");

export class MentionStyled extends MentionBlot {
  static render(data: Mention) {
    const linkElement = document.createElement("a");
    linkElement.classList.add("mention__link");
    linkElement.setAttribute("href", data.link);
    linkElement.setAttribute("target", "_blank");

    const spanElement = document.createElement("span");
    spanElement.classList.add("mention__body");
    spanElement.innerText = `@${data.value}`;
    linkElement.appendChild(spanElement);

    return linkElement;
  }
}
MentionStyled['blotName'] = "styled-mention";

Quill.register(MentionStyled);