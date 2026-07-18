// 精灵立绘映射。
// 图片来源：wiki.biligame.com/rocom（patchwiki.biligame.com/images/rocom）。
// 用 Special:Redirect/file API 按文件名获取，免去 hash 拼接，稳定可靠。
// 4 只原精灵（黑炎/大古拉海象/权杖-Ⅴ/雅丹鬃）在 wiki 无标准立绘，已替换为同属性有立绘的精灵。

// 精灵名 -> wiki 文件名
const petImageFiles: Record<string, string> = {
  迪莫: 'JL_dimo.png',
  火神: 'JL_huoshen.png',
  深蓝鲸: 'JL_shenlanjing.png',
  伊贝儿: 'JL_yibeier.png',
  格兰球: 'JL_gelanqiu.png',
  学院呱呱: 'JL_xueyuanguagua.png',
  绒仙子: 'JL_rongxianzi.png',
  噼啪鸟: 'JL_pipaniao.png',
  松叶羊: 'JL_yesongyang.png',
  帽兜娃娃: 'JL_maodouwawa.png',
  叶眼魔: 'JL_yeyanmo.png',
  星尘虫: 'JL_xingchenchong.png',
  毛头小蛛: 'JL_maotouxiaozhu.png',
  闪电鳗鱼: 'JL_shandianmanyu.png',
  快鳍鱼: 'JL_kuaiqiyu.png',
  利灯鱼: 'JL_lidengyu.png',
  声波缇塔: 'JL_shengbotita.png',
  嘟嘟锅: 'JL_duudguo.png',
  爆焰喷喷: 'JL_baoyanpengpeng.png',
  泥吼牙: 'JL_nihouya.png',
  古钟蛇: 'JL_guzhongshe.png',
  不咕钟: 'JL_buguzhong.png',
  幽影树: 'JL_youlingshu.png',
  翠顶夫人: 'JL_cuidingfuren.png',
  音碟吼: 'JL_yindiehou.png',
  裘卡: 'JL_qiuka.png',
  梦想三三: 'JL_qimengmi.png',
  霹雳迪迪: 'JL_pilididi.png',
  里拉鳐: 'JL_lilayao.png',
  雪影冰灵: 'JL_xueyingwawa_shouling.png',
  凡雀: 'JL_fanque.png',
  凡鹰: 'JL_fanying.png',
  伊兰龙: 'JL_yilanyalong_shouling.png',
  暮星辰: 'JL_muxingchen.png',
  迷嶂布莱克: 'JL_bulaikeyan_shouling.png',
  忽幽狸: 'JL_huyouli.png',
  怒目怂猫: 'JL_numusongmao.png',
  窃光蚊: 'JL_qieguangwen.png',
  牵线木偶: 'JL_qianxianmuou.png',
  古卷匣魔像: 'JL_gujuanxiamoxiang.png',
  古卷执政官: 'JL_gujuanzhizhengguan.png',
  圣水守护: 'JL_shuiling_shouling.png',
  大头骨龙: 'JL_datougulong.png',
  奔波鼠: 'JL_benboshu.png',
  钻石蜗: 'JL_jingshiwo_shouling.png',
  棋契陛下: 'JL_qiqibixia.png',
  // 替补精灵（同属性，wiki 有立绘）
  翼龙: 'JL_yilong.png',
  电企鹅: 'JL_dianqie.png',
  小箱怪: 'JL_xiaoxiangguai.png',
  雪豆丁: 'JL_xuedouding.png',
}

const WIKI_FILE_REDIRECT =
  'https://wiki.biligame.com/rocom/index.php?title=Special:Redirect/file&wpvalue='

export function petImageUrl(petName: string): string | undefined {
  const file = petImageFiles[petName]
  if (!file) return undefined
  return `${WIKI_FILE_REDIRECT}${encodeURIComponent(file)}&wpwidth=480`
}
