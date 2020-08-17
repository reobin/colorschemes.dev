import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { VimPreviewColorType } from "../../types";

import "./index.scss";

/* prettier-ignore */
const template = `
<pre class="Background">
  <code>
    <span class="jsStorageClass">const</span><span class="jsVariableDef"> randomHexColorCode </span><span class="jsOperator">=</span><span class="jsArrowFunction"> () </span><span class="jsArrowFunction">=&gt;</span><span class="jsFuncBraces"> {</span>
      <span class="jsStorageClass">let</span><span class="jsVariableDef"> n </span><span class="jsOperator">=</span><span class="jsParens"> (</span><span class="jsGlobalObjects">Math</span><span class="jsDot">.</span><span class="jsFuncCall">random</span><span class="jsParens">() </span><span class="jsOperator">* </span><span class="jsNumber">0xfffff</span><span class="jsOperator"> * </span><span class="jsNumber">1000000</span><span class="jsParens">)</span><span class="jsDot">.</span><span class="jsFuncCall">toString</span><span class="jsParens">(</span><span class="jsNumber">16</span><span class="jsParens">)</span><span class="jsNoise">;</span>
      <span class="jsReturn">return </span><span class="jsString">"#" </span><span class="jsOperator">+</span><span class="jsFuncBlock"> n</span><span class="jsDot">.</span><span class="jsFuncCall">slice</span><span class="jsParens">(</span><span class="jsNumber">0</span><span class="jsNoise">, </span><span class="jsNumber">6</span><span class="jsParens">)</span><span class="jsNoise">;</span>
    <span class="jsFuncBraces">}</span><span class="jsNoise">;</span>

    <span class="jsGlobalObjects">console</span><span class="jsDot">.</span><span class="jsFuncCall">log</span><span class="jsParens">(</span><span class="jsFuncCall">randomHexColorCode</span><span class="jsParens">())</span><span class="jsNoise">;</span>
  </code>
</pre>
`

const VimPreview = ({ colors, className }) => {
  if (typeof document === "undefined") return null;

  const style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = colors.reduce(
    (styleValue, color) =>
      `${styleValue}.${color.key}{${
        color.key === "Background" ? "background" : "color"
      }:${color.value}}`,
    "",
  );
  document.getElementsByTagName("head")[0].appendChild(style);

  return (
    <div
      className={classnames(className)}
      dangerouslySetInnerHTML={{ __html: template }}
    />
  );
};

VimPreview.propTypes = {
  colors: VimPreviewColorType,
  className: PropTypes.string
};

export default VimPreview;
