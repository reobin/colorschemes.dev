import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { VimPreviewColorType } from "../../types";

import "./index.scss";

/* prettier-ignore */
const createTemplate = uuid => `
<pre class="Background-${uuid}">
  <code>
    <span class="jsStorageClass-${uuid}">const</span><span class="jsVariableDef-${uuid}"> randomHexColorCode </span><span class="jsOperator-${uuid}">=</span><span class="jsArrowFunction-${uuid}"> () </span><span class="jsArrowFunction-${uuid}">=&gt;</span><span class="jsFuncBraces-${uuid}"> {</span>
      <span class="jsStorageClass-${uuid}">let</span><span class="jsVariableDef-${uuid}"> n </span><span class="jsOperator-${uuid}">=</span><span class="jsParens-${uuid}"> (</span><span class="jsGlobalObjects-${uuid}">Math</span><span class="jsDot-${uuid}">.</span><span class="jsFuncCall-${uuid}">random</span><span class="jsParens-${uuid}">() </span><span class="jsOperator-${uuid}">* </span><span class="jsNumber-${uuid}">0xfffff</span><span class="jsOperator-${uuid}"> * </span><span class="jsNumber-${uuid}">1000000</span><span class="jsParens-${uuid}">)</span><span class="jsDot-${uuid}">.</span><span class="jsFuncCall-${uuid}">toString</span><span class="jsParens-${uuid}">(</span><span class="jsNumber-${uuid}">16</span><span class="jsParens-${uuid}">)</span><span class="jsNoise-${uuid}">;</span>
      <span class="jsReturn-${uuid}">return </span><span class="jsString-${uuid}">"#" </span><span class="jsOperator-${uuid}">+</span><span class="jsFuncBlock-${uuid}"> n</span><span class="jsDot-${uuid}">.</span><span class="jsFuncCall-${uuid}">slice</span><span class="jsParens-${uuid}">(</span><span class="jsNumber-${uuid}">0</span><span class="jsNoise-${uuid}">, </span><span class="jsNumber-${uuid}">6</span><span class="jsParens-${uuid}">)</span><span class="jsNoise-${uuid}">;</span>
    <span class="jsFuncBraces-${uuid}">}</span><span class="jsNoise-${uuid}">;</span>

    <span class="jsGlobalObjects-${uuid}">console</span><span class="jsDot-${uuid}">.</span><span class="jsFuncCall-${uuid}">log</span><span class="jsParens-${uuid}">(</span><span class="jsFuncCall-${uuid}">randomHexColorCode</span><span class="jsParens-${uuid}">())</span><span class="jsNoise-${uuid}">;</span>
  </code>
</pre>
`

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const VimPreview = ({ colors, className }) => {
  if (typeof document === "undefined") return null;

  const uuid = uuidv4();

  const style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = colors.reduce(
    (styleValue, { group, color }) =>
      `${styleValue}.${group}-${uuid}{${
        group === "Background" ? "background" : "color"
      }:${color}}`,
    "",
  );
  document.getElementsByTagName("head")[0].appendChild(style);

  const template = createTemplate(uuid);

  return (
    <div
      className={classnames(className)}
      dangerouslySetInnerHTML={{ __html: template }}
    />
  );
};

VimPreview.propTypes = {
  colors: PropTypes.arrayOf(VimPreviewColorType),
  className: PropTypes.string,
};

export default VimPreview;
