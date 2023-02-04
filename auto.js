"nodejs";
const { launchApp } = require("app");
const { click, performGlobalAction } = require("accessibility");
const { delay } = require("lang");
const { execScriptFile, myEngine } = require("engines");
const { requestScreenCapture, Orientation } = require("media_projection");
const { findImageSync, readImageSync } = require("image");
const { showToast } = require("toast");

// 操作时延
const UITIME = 6 * 1000;
// 搜图次数上限
const TIMES = 10;
// 相关图片路径
var picPath = "./pic/";

// 主函数，用async标记以便使用await来等待结果
async function main() {
    let self = myEngine();
    // 兽耳助手签到
    if (self.execArgv.kemomimi) await kemomimi();
    // 米游社签到
    if (self.execArgv.hyperion) await hyperion();
    // pcr日常
    if (self.execArgv.pcr) await pcr(self);
}
// 执行主函数
main();
// 兽耳助手模块
// 兽耳助手签到
async function kemomimi() {
    // 更改相关图片路径
    picPath = "./pic/kemomimi/";
    // 启动兽耳助手app
    launchApp("兽耳助手");
    await delay(3000);
    // 等待开屏广告
    await findImage("兽耳助手_每日签到");
    // 点击每日签到
    await click(133, 527);
    await delay(UITIME);
    // 点击签到
    await click(513, 644);
    await delay(UITIME);
    // 关闭签到弹窗
    await click(549, 181);
    await delay(UITIME);
    // 返回到主界面
    performGlobalAction(1);
    await delay(UITIME);
    // 点击头像
    await click(105, 269);
    await delay(UITIME);
    // 点击会员
    await click(164, 787);
    await delay(UITIME);
    // 点击会员抽奖
    await click(516, 1526);
    await delay(UITIME);
    // 关闭抽奖弹窗
    await click(549, 181);
    await delay(UITIME);
    // 点击每日能量
    await click(516, 1726);
    await delay(UITIME);
    // 关闭能量弹窗
    await click(549, 181);
    await delay(UITIME);
    // 返回到主界面
    performGlobalAction(1);
    await delay(UITIME);
    // 关闭头像栏
    performGlobalAction(1);
    await delay(UITIME);
    // 点击我的助手
    await click(549, 2239);
    await delay(UITIME);
    // 点击兑换
    await click(968, 685);
    await delay(UITIME);
    // 返回到主界面
    performGlobalAction(1);
    await delay(UITIME);
    performGlobalAction(1);
    await delay(500);
    performGlobalAction(1);
}
// pcr模块
// pcr自动化
async function pcr() {
    //更改相关图片路径
    picPath = "./pic/pcr/"
    let self = myEngine();
    // 启动游戏app
    launchApp("公主连结R");
    // 等待开启app
    await delay(UITIME);
    // 寻找到适龄提示说明进入标题界面
    if (await findImage("标题界面_适龄提示")) await click(1230, 800);
    // 初次登录寻找跳过签到按钮
    await click_Point2(await findImage("跳过按钮"));
    // 等待界面加载
    await delay(UITIME);
    // 有人生日
    await click_Point2(await findImage("跳过按钮"));
    // 寻找到关闭按钮说明有通知页面
    await click_Point2(await findImage("关闭按钮"));
    await adventure();
    if (self.execArgv.normalEgg) {
        showToast("普通扭蛋");
        // 普通扭蛋
        await normalEgg();
        await adventure();
    }
    if (self.execArgv.jjc) {
        showToast("战斗竞技场");
        // 战斗竞技场
        await jjc();
        await adventure();
    }
    if (self.execArgv.pjjc) {
        showToast("公主竞技场");
        // 公主竞技场
        await pjjc();
        await adventure();
    }
    if (self.execArgv.search) {
        showToast("探索");
        // 探索
        await search();
        await adventure();
    }
    if (self.execArgv.dungeons) {
        showToast("地下城");
        // 地下城
        await dungeons();
        await adventure();
    }
    showToast("打完了喵");
}

// 米游社模块
async function hyperion() {
    picPath = "./pic/hyperion/"
    // 启动米游社app
    launchApp("米游社");
    // 点击开屏广告跳过按钮
    await findImage("开屏广告");
    // 进入签到界面
    await findImage("签到福利");
    // 点击签到
    await findImage("签到");
    // 返回到主界面
    performGlobalAction(1);
    await delay(UITIME);
    performGlobalAction(1);
    await delay(500);
    performGlobalAction(1);
}

// 通用功能函数
// 点击一个点2
async function click_Point2(point_xy) {
    if (point_xy == null) return false;
    await click(point_xy.x, point_xy.y);
    await delay(UITIME);
    return true;
}

// 搜索图片
async function findImage(name = new String) {
    const img = readImageSync(picPath + name + ".jpg");
    let point_xy = null;
    // 寻找图片
    var capturer = await requestScreenCapture()
    for (let index = 0; point_xy == null && index < TIMES; index++) {
        let src = await capturer.nextImage();
        point_xy = await findImageSync(src, img, { "threshold": 0.8 });
        src.recycle();
        await delay(1000);
    }
    // 停止截图
    capturer.stop();
    // 回收图片
    img.recycle();
    if (point_xy == null) console.log("没找到" + name + ".jpg");
    return point_xy;
}

// pcr通用函数
// 增加扫荡次数并使用跳过
async function mop_up(times = new Number) {
    // 如果剩余挑战次数为0
    if (await findImage("扫荡_剩余挑战次数0") != null) return false;
    // 单次扫荡
    if (times == 1) {
        await click_Point2(await findImage("挑战按钮"));
        await delay(UITIME);
        await click_Point2(await findImage("战斗开始按钮"));
        await delay(UITIME);
    }
    else {
        for (let index = 0; index < times - 1; index++) {
            await click_Point2(await findImage("扫荡_增加劵"));
        }
        // 使用
        await click_Point2(await findImage("扫荡_使用劵"));
        // 确认
        await click_Point2(await findImage("确认按钮_蓝字"));
        // 跳过
        await click_Point2(await findImage("扫荡_跳过完毕"));
        // 确认
        await click_Point2(await findImage("确认按钮_白字"));
    }
    // 消耗体力后检测是否有限定商店
    if (await restricted_store() == true) return true;
    else return false;
}

// 限定商店
async function restricted_store() {
    // 是否出现限定商店
    if (await click_Point2(await findImage("限定商店"))) {
        for (let index = 0; index < 8; index++) {
            await click_Point2(await findImage("商店_选择框"));
        }
        await click_Point2(await findImage("批量购入"));
        await click_Point2(await findImage("确认按钮_蓝字"));
        await click_Point2(await findImage("确认按钮_蓝字"));
        await click_Point2(await findImage("限定商店_立即关闭"));
        await click_Point2(await findImage("确认按钮_蓝字"));
        await click_Point2(await findImage("取消按钮_白字"));
        await click_Point2(await findImage("限定商店_返回按钮"));
        return true;
    }
    else return false;
}

// 连点函数
async function societyFight(auto5 = new Boolean, auto4 = new Boolean, auto3 = new Boolean, auto2 = new Boolean, auto1 = new Boolean, time = new Number) {
    // 直到战斗结束，连点所选位置
    newScript = execScriptFile("./societyFight.js", {
        "arguments":
        {
            "auto1": auto1,
            "auto2": auto2,
            "auto3": auto3,
            "auto4": auto4,
            "auto5": auto5,
        }
    });
    // 每隔time s轮询一次是否结束
    for (await delay(time * 1000); await findImage("战斗_菜单") != null; await delay(time * 1000));
    // 停止出刀脚本
    newEngine = await newScript.engine();
    await newEngine.forceStop();
    // 等待真正结束
    await delay(20 * 1000);
}

// pcr时效函数
// 活动困难关卡
async function event_hard(event) {
    // 进入关卡
    if (await click_Point2(await findImage(event)) == true) {
        // 每日奖励
        await click_Point2(await findImage("关闭按钮"));
        // 跳过每日剧情
        if (await findImage("剧情_菜单") != null) {
            await delay(UITIME);
            await click(426, 422);
            await click_Point2(await findImage("关闭按钮"));
        }
        // 进入困难关卡
        await click_Point2(await findImage("活动_活动关卡"));
        //await click_Point2(await findImage("活动_困难"));
        for (let index = 1; index <= 5; index++) {
            if (await click_Point2(await findImage("活动_H1-" + index)) == true) {
                await mop_up(3);
                // 关闭信赖度提升提示
                await click_Point2(await findImage("取消按钮_白字"));
                // 关闭挑战页面
                await click_Point2(await findImage("取消按钮_白字"));
            }
        }
        // 扫荡高难boss
        if (await click_Point2(await findImage("活动_高难")) == true) {
            await mop_up(1);
            // 开启自动
            await click_Point2(await findImage("战斗_自动_白字"));
            // 开启二倍速
            if ((point_xy = await findImage("战斗_二倍速_白字")) != null) {
                await click_Point2(point_xy);
            }
            // 每隔10s轮询一次是否结束
            for (await delay(10 * 1000); await findImage("战斗_菜单") != null; await delay(10 * 1000));
            await click_Point2(await findImage("下一步按钮"));
            await click_Point2(await findImage("下一步按钮"));
        }
        // 关闭数量到达提醒
        if (await findImage("剧情_菜单") != null) {
            await delay(UITIME);
            await click(426, 422);
            await click_Point2(await findImage("关闭按钮"));
        }
        // 活动任务领取奖励
        if (await click_Point2(await findImage("活动_活动任务")) == true) {
            await click_Point2(await findImage("任务_全部收取"));
            await click_Point2(await findImage("关闭按钮"));
            await click_Point2(await findImage("任务_普通"));
            await click_Point2(await findImage("任务_全部收取"));
            await click_Point2(await findImage("关闭按钮"));
        }
        // 返回到关卡
        await click_Point2(await findImage("返回按钮"));
        // 返回到活动主界面
        await click_Point2(await findImage("返回按钮"));
        // 讨伐证交换
        await click_Point2(await findImage("活动_讨伐证交换"));
        await click_Point2(await findImage("活动_讨伐证交换_100次"));
        // 直到出现确认按钮，说明已经用完讨伐证
        while (await click_Point2(await findImage("确认按钮_白字")) == false) {
            // 如果已经全部获得
            if (await click_Point2(await findImage("确认按钮_蓝字")) == true) {
                await click_Point2(await findImage("活动_讨伐证交换_重置"));
                await click_Point2(await findImage("确认按钮_蓝字"));
                await click_Point2(await findImage("活动_讨伐证交换_100次"));
            }
            if (await click_Point2(await findImage("活动_讨伐证交换_再次交换_蓝字")) == false) {
                await click_Point2(await findImage("活动_讨伐证交换_再次交换_白字"));
            }
            await click_Point2(await findImage("活动_讨伐证交换_查看已获得道具"));
        }
    }

}

/* // 兰德索尔杯
async function landsol_cup(number) {
    // 兰德索尔杯选马
    await click_Point2(await findImage("兰德索尔杯_" + number));
    await click_Point2(await findImage("兰德索尔杯_竞赛开始"));
    await click_Point2(await findImage("跳过按钮"));
    await click_Point2(await findImage("兰德索尔杯_结束"));
} */

// pcr日常函数
// 回到冒险界面
async function adventure() {
    if (await click_Point2(await findImage("主界面_冒险")) == false) {
        await click_Point2(await findImage("主界面_冒险_已被选中"));
    }
    await delay(UITIME);
}

// 抽选普通扭蛋
async function normalEgg() {
    // 进入扭蛋
    if (await click_Point2(await findImage("主界面_扭蛋"))) {
        // 选择普通
        await click_Point2(await findImage("扭蛋界面_普通"));
        // 点击抽选
        await click_Point2(await findImage("扭蛋界面_免费"));
        // 确认
        await click_Point2(await findImage("确认按钮_蓝字"));
        // 关闭结果
        await click_Point2(await findImage("确认按钮_白字"));
    }

}

// jjc
async function jjc() {
    // 进入竞技场
    if (await click_Point2(await findImage("冒险界面_战斗竞技场"))) {
        // 跳过可能出现的防御成功
        await click_Point2(await findImage("取消按钮_白字"));
        // 收取jjc金币
        await click_Point2(await findImage("收取按钮"));
        // 关闭提醒菜单
        await click_Point2(await findImage("确认按钮_白字"));
        // 选择对手
        await click_Point2(await findImage("竞技场_选择一名对手"));
        // 战斗开始
        await click_Point2(await findImage("战斗开始按钮"));
        // 下一步
        await click_Point2(await findImage("下一步按钮_小"));
        //  不小心赢了
        await delay(UITIME);
        await click(2258, 679);
        await delay(UITIME);
    }

}

// pjjc
async function pjjc() {
    // 进入公主竞技场
    if (await click_Point2(await findImage("冒险界面_公主竞技场"))) {
        // 跳过可能出现的防御成功
        await click_Point2(await findImage("取消按钮_白字"));
        // 收取pjjc金币
        await click_Point2(await findImage("收取按钮"));
        // 关闭提醒菜单
        await click_Point2(await findImage("确认按钮_白字"));
        // 选择对手
        await click_Point2(await findImage("公主竞技场_选择一名对手"));
        // 队伍2
        await click_Point2(await findImage("队伍2按钮"));
        // 队伍3
        await click_Point2(await findImage("队伍3按钮"));
        // 战斗开始
        await click_Point2(await findImage("战斗开始按钮"));
        await delay(UITIME + UITIME);
        // 下一步
        await click_Point2(await findImage("下一步按钮_小"));
        // 不小心赢了
        await delay(UITIME);
        await click(2258, 679);
        await delay(UITIME);
    }

}

// 探索
async function search() {
    // 进入探索
    if (await click_Point2(await findImage("冒险界面_探索"))) {
        // 选择经验值关卡
        await click_Point2(await findImage("探索界面_经验值关卡"));
        // 选择经验值关卡10级
        await click_Point2(await findImage("探索界面_经验值关卡10级"));
        // 使用2张进行扫荡
        // 使用
        await click_Point2(await findImage("扫荡_使用劵"));
        // 确认
        await click_Point2(await findImage("确认按钮_蓝字"));
        // 跳过
        await click_Point2(await findImage("扫荡_跳过完毕"));
        // 确认
        await click_Point2(await findImage("确认按钮_白字"));
        // 前往玛那关卡
        await click_Point2(await findImage("探索界面_前往玛那关卡"));
        // 选择玛娜关卡10级
        await click_Point2(await findImage("探索界面_玛那关卡10级"));
        // 使用2张进行扫荡
        // 使用
        await click_Point2(await findImage("扫荡_使用劵"));
        // 确认
        await click_Point2(await findImage("确认按钮_蓝字"));
        // 跳过
        await click_Point2(await findImage("扫荡_跳过完毕"));
        // 确认
        await click_Point2(await findImage("确认按钮_白字"));
        //进入探索首页
        await click_Point2(await findImage("进入探索首页"));
    }

}

// 公会之家点赞
async function good() {
    // 进入公会之家
    if (await click_Point2(await findImage("主界面_公会之家"))) {
        // 搜到了点击无效
        await click_Point2(await findImage("公会之家_点赞信息"));
        // 被点赞了关闭提示
        if (await click_Point2(await findImage("公会之家_被点赞了"))) await click_Point2(await findImage("关闭按钮"));
        await click_Point2(await findImage("公会之家_点赞的人"));
        await click_Point2(await findImage("公会之家_点赞"));
        await click_Point2(await findImage("关闭按钮"));
        await click_Point2(await findImage("公会之家_返回"));
    }

}

// 地下城
async function dungeons() {
    // 进入地下城
    if (await click_Point2(await findImage("冒险界面_地下城"))) {
        // 1层
        if (await click_Point2(await findImage("地下城_1层"))) {
            // 挑战
            if (await click_Point2(await findImage("挑战按钮"))) {
                // 我的队伍 
                await click_Point2(await findImage("我的队伍"));
                // 呼出攒tp第1队
                await click_Point2(await findImage("我的队伍_呼出第1队"));
                // 开始战斗
                await click_Point2(await findImage("战斗开始按钮"));
                // 开启三倍速
                if ((point_xy = await findImage("战斗_二倍速_白字")) != null) {
                    await click_Point2(point_xy);
                    await click_Point2(point_xy);
                }
                // 每隔5s轮询一次是否结束
                for (await delay(5 * 1000); await findImage("战斗_菜单") != null; await delay(5 * 1000));
                // 点击下一步
                await click_Point2(await findImage("下一步按钮"));
                // 点击确认
                await click_Point2(await findImage("确认按钮_白字"));
            }

        }

        // 2层
        if (await click_Point2(await findImage("地下城_2层"))) {
            // 挑战
            if (await click_Point2(await findImage("挑战按钮"))) {
                // 开始战斗
                await click_Point2(await findImage("战斗开始按钮"));
                // 每隔5s轮询一次是否结束
                for (await delay(5 * 1000); await findImage("战斗_菜单") != null; await delay(5 * 1000));
                // 点击下一步
                await click_Point2(await findImage("下一步按钮"));
                // 点击确认
                await click_Point2(await findImage("确认按钮_白字"));
            }

        }

        // 3层
        if (await click_Point2(await findImage("地下城_3层"))) {
            // 挑战
            if (await click_Point2(await findImage("挑战按钮"))) {
                // 开始战斗
                await click_Point2(await findImage("战斗开始按钮"));
                // 每隔5s轮询一次是否结束
                for (await delay(5 * 1000); await findImage("战斗_菜单") != null; await delay(5 * 1000));
                // 点击下一步
                await click_Point2(await findImage("下一步按钮"));
                // 点击确认
                await click_Point2(await findImage("确认按钮_白字"));
            }

        }

        // 4层
        if (await click_Point2(await findImage("地下城_4层"))) {
            // 挑战
            if (await click_Point2(await findImage("挑战按钮"))) {
                // 开始战斗
                await click_Point2(await findImage("战斗开始按钮"));
                // 每隔5s轮询一次是否结束
                for (await delay(5 * 1000); await findImage("战斗_菜单") != null; await delay(5 * 1000));
                // 点击下一步
                await click_Point2(await findImage("下一步按钮"));
                // 点击确认
                await click_Point2(await findImage("确认按钮_白字"));
            }

        }

        // 5层
        if (await click_Point2(await findImage("地下城_5层"))) {
            // 挑战
            if (await click_Point2(await findImage("挑战按钮"))) {
                // 开始战斗
                await click_Point2(await findImage("战斗开始按钮"));
                // 每隔10s轮询一次是否结束
                for (await delay(10 * 1000); await findImage("战斗_菜单") != null; await delay(10 * 1000));
                // 点击下一步
                await click_Point2(await findImage("下一步按钮"));
                // 点击确认
                await click_Point2(await findImage("确认按钮_白字"));
                // 寄了，再出一刀捏
                if (await click_Point2(await findImage("地下城_前往地下城"))) {
                    // 重新进入5层
                    await click_Point2(await findImage("地下城_5层"));
                    // 挑战
                    await click_Point2(await findImage("挑战按钮"));
                    // 我的队伍 
                    await click_Point2(await findImage("我的队伍"));
                    // 切换到地下城分组
                    await click_Point2(await findImage("我的队伍_地下城"));
                    // 呼出第2队 
                    await click_Point2(await findImage("我的队伍_呼出第2队"));
                    // 开始战斗
                    await click_Point2(await findImage("战斗开始按钮"));
                    // 开启自动
                    await click_Point2(await findImage("战斗_自动_白字"));
                    // 开启三倍速
                    if ((point_xy = await findImage("战斗_二倍速_白字")) != null) {
                        await click_Point2(point_xy);
                        await click_Point2(point_xy);
                    }
                    // 每隔10s轮询一次是否结束
                    for (await delay(10 * 1000); await findImage("战斗_菜单") != null; await delay(10 * 1000));
                    // 战斗结束
                    await click_Point2(await findImage("下一步按钮"));
                    // 点击确认
                    await click_Point2(await findImage("确认按钮_白字"));
                } else {
                    // 我超，一刀春黑，战斗结束
                    await click_Point2(await findImage("下一步按钮"));
                    // 点击确认
                    await click_Point2(await findImage("确认按钮_白字"));
                }
            }


        }
        // 选择EX3 绿龙的骸岭
        await click_Point2(await findImage("地下城_EX3"));
        // 确认进入
        await click_Point2(await findImage("确认按钮_蓝字"));
    }
}

// pcr体力相关
// 领取公会之家
async function societyHome() {
    // 进入公会之家
    if (await click_Point2(await findImage("主界面_公会之家"))) {
        // 全部收取
        await click(2285, 874);
        await delay(UITIME);
        // 关闭提醒菜单
        await click(1230, 963);
        await delay(UITIME);
    }

}


// 调查五种
async function survey() {
    // 进入调查
    if (await click_Point2(await findImage("冒险界面_调查"))) {
        // 进入圣迹调查
        await click_Point2(await findImage("调查界面_圣迹调查"));
        // 挑战1~3级圣迹调查关卡
        // 使用标志来存储每次扫荡后是否出现限定商店
        for (let index = 1, flag = true; index <= 3; index++) {
            if (flag) await click_Point2(await findImage("调查_" + index + "级"));
            // 存储是否出现限定商店
            flag = await mop_up(5);
        }
        // 回到选择关卡界面
        await click_Point2(await findImage("返回按钮"));
        // 选择神殿调查
        await click_Point2(await findImage("调查界面_神殿调查"));
        // 挑战1~2级神殿调查关卡
        // 使用标志来存储每次扫荡后是否出现限定商店
        for (let index = 1, flag = true; index <= 2; index++) {
            if (flag) await click_Point2(await findImage("调查_" + index + "级"));
            // 存储是否出现限定商店
            flag = await mop_up(5);
        }
    }

}

// 领取任务奖励
async function quest() {
    // 进入我的主页
    if (await click_Point2(await findImage("主界面_我的主页")) == false) {
        await click_Point2(await findImage("主界面_我的主页_已被选中"))
    }
    // 点击任务
    if (await click_Point2(await findImage("主页界面_任务"))) {
        // 点击全部收取
        await click_Point2(await findImage("任务_全部收取"));
        // 关闭报酬确认
        await click_Point2(await findImage("关闭按钮"));
        // 点击普通
        await click_Point2(await findImage("任务_普通"));
        // 关闭报酬确认
        await click_Point2(await findImage("关闭按钮"));
    }

}

// 商店购买
async function store() {
    // 返回主页
    if (await click_Point2(await findImage("主界面_我的主页")) == false) {
        await click_Point2(await findImage("主界面_我的主页_已被选中"))
    }
    // 进入商店
    if (await click_Point2(await findImage("主页界面_商店"))) {
        // 地下城商店
        if (await click_Point2(await findImage("商店_地下城"))) {
            // 尽量选取，直到地下城币不够
            for (index = 0; index < 8; index++) {
                if (await click_Point2(await findImage("商店_选择框")) == false) break;
            }
            // 地下城币不足则会有提示
            await click_Point2(await findImage("取消按钮_白字"));
            await click_Point2(await findImage("批量购入"));
            await click_Point2(await findImage("确认按钮_蓝字"));
            await click_Point2(await findImage("确认按钮_蓝字"));
        }
        // 竞技场商店
        if (await click_Point2(await findImage("商店_竞技场"))) {
            // 选取最靠右的选择框(莫妮卡)
            await click_Point2(await findImage("商店_最靠右的选择框"));
            // 币够时购买
            if (await click_Point2(await findImage("取消按钮_白字")) == false) {
                await click_Point2(await findImage("批量购入"));
                await click_Point2(await findImage("确认按钮_蓝字"));
                await click_Point2(await findImage("确认按钮_蓝字"));
                // 点击最靠右的选择框(璃乃)
                await click_Point2(await findImage("商店_最靠右的选择框"));
                // 币够时购买
                if (await click_Point2(await findImage("取消按钮_白字")) == false) {
                    await click_Point2(await findImage("批量购入"));
                    await click_Point2(await findImage("确认按钮_蓝字"));
                    await click_Point2(await findImage("确认按钮_蓝字"));
                }
            }
        }
        // 公主竞技场商店
        if (await click_Point2(await findImage("商店_公主竞技场"))) {
            // 选取铃奈左边的选择框(纺希)
            await click_Point2(await findImage("商店_公主竞技场_铃奈左边的选择框"));
            // 币够时购买
            if (await click_Point2(await findImage("取消按钮_白字")) == false) {
                await click_Point2(await findImage("批量购入"));
                await click_Point2(await findImage("确认按钮_蓝字"));
                await click_Point2(await findImage("确认按钮_蓝字"));
            }
        }
    }
}



