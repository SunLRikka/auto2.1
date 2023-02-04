"ui nodejs";


const { createWindow } = require("floating_window");
const { delay } = require("lang");
const { execScriptFile, myEngine } = require('engines');
const { showToast } = require("toast");

//二者需保持一致
const pcr_count = 6;
const tasks = ["pcr","normalEgg", "jjc", "pjjc", "search", "dungeons","kemomimi","hyperion"]
schedule = {
    "pcr": false,
    "normalEgg": false,
    "jjc": false,
    "pjjc": false,
    "search": false,
    "dungeons": false,
    "kemomimi": false,
    "hyperion": false
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

    //获取pcr复选框
    const pcrCheckbox = window.view.findView('pcr');
    pcrCheckbox.on("click",() =>{
        // 0 4 8 可见，不可见，隐藏
        // 如果pcr被选中，则显示
        if(pcrCheckbox.isChecked()){
                window.view.findView('pcrs').setVisibility(0);
        }
        // 否则隐藏相关选项
        else{
                window.view.findView('pcrs').setVisibility(8);
        }
    });
    // 显示悬浮窗
    await window.show();
    await delay(200);
}
main();
$autojs.keepRunning();