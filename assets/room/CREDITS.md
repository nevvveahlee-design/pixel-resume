# 房间美术素材来源

## Pixel Interior – Cozy 16x16 Bedroom Top Down Tileset
- 作者：bitglow (https://bitglow.itch.io)
- 来源：https://bitglow.itch.io/pixelinterior-bedroom
- License：Bitglow Asset License —— 允许个人/商业项目使用和修改，禁止单独转卖/重新分发素材原文件、禁止把素材收进另一个素材包再分发。原始 license 文件见 `bitglow_bedroom/license.txt`。
- 用在本项目的文件：
  - `sprites/wardrobe.png` —— 取自 `wardrobes_BR.png` 白色款（开门款式），**代码重新上色成鼠尾草绿**（明度不变只换色相，柜内彩色衣服饱和度本来就高，重映射阈值会跳过，颜色保持原样），用于"衣柜"热点
  - `sprites/dresser.png` —— 取自 `wardrobes_BR.png` 白色款五斗柜，**代码重新上色成雾霾蓝**，用于"收纳盒"热点
  - `sprites/rug.png` —— 取自 `decorations_BR.png`，米色地毯，未改色
  - `sprites/trophies.png` —— 取自 `decorations_BR.png`，奖杯图标，未改色，用于"奖状墙"热点
  - `sprites/frame_sky.png` —— 取自 `decorations_BR.png`，画框，备用装饰，未改色
  - `sprites/basket.png` —— 取自 `decorations_BR.png`，**其实是个复古双铃闹钟**（文件名叫 basket 是我最早认错了，图案没变），未改色，放在收纳盒上面（重新裁过一次去掉透明留白，不然会显得"悬空"）

## 穿衣镜（改成纯 CSS 画的椭圆镜子）
找了两轮素材包，能挖到的镜子要么是细长的立镜（太窄），要么是带桌腿的整套梳妆台（挂在收纳盒上方会不合逻辑——那是一件独立落地家具，不是挂墙镜子）。镜子本身是简单几何图形（椭圆+边框），直接用 CSS 画更可控，宽高比自己定，位置精确卡在收纳盒顶面（用 `bottom` 定位而不是 `top`，保证镜子底边真正贴在收纳盒上沿，不会再悬空）。
  - `sprites/bed_pink.png` —— 取自 `beds_BR.png` 的灰白色床款式，**代码重新上色成粉色**（保留原图明暗结构，只把中性灰色调换成同亮度的粉色调），符合 license 里"可以修改素材"的条款

## Pixel Interior – Cozy 16x16 Living Room & Kitchen Top Down Tileset
- 作者：bitglow（同上）
- 来源：https://bitglow.itch.io/pixelinterior-livingroomkitchen
- License：同上，Bitglow Asset License，允许个人/商业使用和修改，禁止单独转卖/重新分发。
- 用在本项目的文件：
  - `sprites/wall_tile.png` —— 取自 `floorswalls_LRK.png`，木纹墙板（横向平铺），未改色
  - `sprites/window.png` —— 取自 `doorswindowsstairs_LRK.png`，木框窗户，未改色
  - `sprites/bookshelf.png` —— 取自 `cabinets_LRK.png`，未改色，用于"书架"热点
  - `sprites/tv.png` —— 取自 `livingroom_LRK.png`，未改色，用于"显示器"热点
  - `sprites/laptop.png` —— 取自 `livingroom_LRK.png`，未改色，用于"笔记本"热点
  - `sprites/plant.png` —— 取自 `decorations_LRK.png`，未改色
  - `sprites/frame_sunset.png`、`sprites/frame_hills.png` —— 取自 `decorations_LRK.png`，风景画框，未改色，`frame_sunset.png` 用于"海报"热点（这个包里没有真正的"海报"素材，用风景画框代替墙面装饰）

## Electronics Pixel Pack
- 作者：Blue?
- 来源：https://blue00.itch.io/electronics-pixel-pack
- License：允许商用/非商用（游戏、视频、图片），禁止转卖，署名非必须但作者希望能标注。
- 用在本项目的文件：
  - `sprites/monitor.png`、`sprites/laptop.png` —— 取自 `electronics1.png`，未改色，用于"显示器"/"笔记本"热点（替换了之前用 bitglow 客厅包里电视图标的版本）
  - `sprites/curio_headphones.png`、`sprites/curio_gamepad.png`、`sprites/curio_camera.png`、`sprites/curio_radio.png` —— 同样取自 `electronics1.png`（耳机、手柄、拍立得相机、收音机），未改色，用于房间下方"桌角好物"彩蛋区，跟简历板块无关，纯装饰

## Pixel Interior 客厅包补充
- `sprites/rug_big.png` —— 取自 `livingroom_LRK.png`，比之前卧室包里那张更大的圆点纹地毯，未改色
- `sprites/frame_sunset.png`、`sprites/frame_hills.png` —— 重新裁剪修正（原来裁切位置算错了，图片是变形的），现在是正常比例的风景画框

## Pixel Interior 客厅包再补充（生活小物）
- `sprites/floor_lamp.png` —— 取自 `decorations_LRK.png`，未改色，放在书桌旁。
- `sprites/clock.png` —— 取自 `decorations_LRK.png`，圆钟，一开始因为跟"双铃闹钟"重复没用上；房间加大之后软木板和窗户之间空出一段墙，重新捡回来用了。跟其它家具统一描边风格时**把描边（明度<0.15 的像素）收窄改成跟其它家具一致的深棕色**，钟面颜色没动。
- `sprites/mirror.png` —— 取自 `decorations_LRK.png`，最终没有采用（换成了 CSS 画的椭圆镜子），文件还留着没删。
- `sprites/plant2.png` —— 取自 `livingroom_LRK.png` 里的 `plant2.png`，跟已有的那盆绿植不同姿态，未改色，填衣柜和书桌之间的地板空隙。
- `sprites/plant3.png` —— 取自 `livingroom_LRK.png` 里的 `r2c3.png`，圆叶丛生盆栽，又一个不同姿态，未改色，放在书桌和落地灯之间的地板空隙。

## Pixel Interior 客厅包再补充（书架换新）
- `sprites/bookshelf.png` —— 取自 `cabinets_LRK.png`，换成细节更丰富、书脊颜色更多样的一款（原来那款太素）。**代码重新上色**：书架框架/隔板部分调成跟床/衣柜/收纳盒同一家族的暖黄色调，书脊本身饱和度较高的颜色保留不动，所以书还是五颜六色的，只有木框变了色。
- `sprites/desk.png` —— 第一版取自 `livingroom_LRK.png`，用户反馈"丑"，换成了下面 Pixel Life 包里的桌子。

## Pixel Life: Desk Essentials
- 作者：Chris Perich (https://christianperich.itch.io)
- 来源：https://christianperich.itch.io/pixel-life-office-essentials（免费文件是其中的 "Pixel Life - Desk Essentials.zip"，其余安防/家具扩展内容需要付费，没有用到）
- License：个人 + 商业项目免费使用，允许修改，不能把原始文件单独转卖或重新分发。
- 用在本项目的文件：
  - `sprites/desk.png` —— 取自 `spritesheet.png` 里唯一一款书桌（浅橡木色，带抽屉细节），**代码重新上色**成跟房间 `--wood` 变量同色系的暖棕色（保留明度结构，只换色相/饱和度），替换掉第一版从 bitglow 客厅包里裁的那个纯色桌子。后来跟其它素材放在一起对比发现描边颜色比其它家具浅一截，又**单独把描边（明度<0.24 的像素）统一改成跟其它家具一致的深棕色**，桌面/桌腿本身的颜色没动。

## Pixel Paintings Pack – Framed Art for Cozy Interiors
- 作者：Biruk Okami
- 来源：https://biruk-okami.itch.io/pixel-paintings-pack-framed-art-for-cozy-interiors
- License：允许商业和非商业项目、个人/学生/职业作品使用，name-your-own-price 免费下载。
- 用在本项目的文件：
  - `sprites/poster_mountain.png` —— 紫色雪山风景画，未改色，替换了"海报"热点原来的图（原来那张风景画框比例算错了，现在换成这个真正精致的框）
  - `sprites/painting_sunset.png` —— 日落风景画，未改色，用作书架上方的纯装饰挂画

## shubibubi Cozy Interior（评估后未采用）
- 免费版只有一张 5.5KB 的小样图（桌椅+柜子+一点花纹+绿植+地毯），跟商店页描述的"19张海报+宠物+丰富装饰"完全不是一回事，那些内容都在 $3.99 付费版里。因为跟已有素材重复度高、内容量对不上预期，最终没有采用，仅供记录。

## 使用须知
- 原始素材文件（`bitglow_bedroom/` 目录下）按 license 要求不应该被单独提取出来再分发给项目之外的人；如果这个仓库要公开发布，注意不要把 `bitglow_bedroom/` 整个目录当成"素材包"分享出去，只保留网页实际引用的 `sprites/` 里裁好的几张图即可。
