/**
 * 小红书首页信息流去广告（Surge）
 * 仅处理 /api/sns/v6/homefeed，避免对搜索、私信、评论等接口做额外脚本处理。
 */

const body = $response.body;

if (!body) {
  $done({});
} else {
  try {
    const obj = JSON.parse(body);

    if (obj && Array.isArray(obj.data)) {
      obj.data = obj.data.filter((item) => {
        if (!item || typeof item !== "object") return true;

        if (item.model_type === "live_v2") return false;
        if (Object.prototype.hasOwnProperty.call(item, "ads_info")) return false;
        if (Object.prototype.hasOwnProperty.call(item, "card_icon")) return false;
        if (Array.isArray(item.note_attributes) && item.note_attributes.includes("goods")) return false;

        if (item.related_ques) delete item.related_ques;
        return true;
      });
    }

    $done({ body: JSON.stringify(obj) });
  } catch (e) {
    console.log(`[XHS] homefeed parse failed: ${e}`);
    $done({ body });
  }
}
