"ui nodejs";


const { createWindow } = require("floating_window");
const { delay } = require("lang");
const { execScriptFile, myEngine } = require('engines');
const { showToast } = require("toast");

const tasks = ["normalEgg", "jjc", "pjjc", "search", "dungeons","kemomimi"]
schedule = {
    "normalEgg": false,
    "jjc": false,
    "pjjc": false,
    "search": false,
    "dungeons": false,
    "kemomimi": false
}

async function main() {
    // 创建悬浮窗
    let window = createWindow();
    // 根据XML文件设置悬浮窗内容
    await window.setViewFromXmlFile("./fw.xml");

    // 获取关闭按钮
    const closeButton = window.view.findView('close');
    closeButton.on("click", () => {
        window.close();
        process.exit();
    });

    const startButton = window.view.findView('start');
    startButton.on("click", () => {
        for (var i = 0; i < tasks.length; i++) {
            schedule[tasks[i]] = window.view.findView(tasks[i]).isChecked();
        }
        execScriptFile("./auto.js", {arguments : schedule});
        myEngine().forceStop();
    })
    // 显示悬浮窗
    await window.show();
    await delay(200);
}
main();
$autojs.keepRunning();