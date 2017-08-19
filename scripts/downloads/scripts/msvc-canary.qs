function Component() {
    if (systemInfo.kernelType === "winnt") {
        component.setValue("Virtual", "false");
        component.setValue("Default", "false"); // bleeding
    } else {
        component.setValue("Virtual", "true");
        component.setValue("Enabled", "false");
    }
}

Component.prototype.createOperations = function()
{
    component.createOperations();

    component.addOperation("CreateShortcut", "@TargetDir@/bleeding/citra-qt.exe", "@StartMenuDir@/Citra-Bleeding.lnk",
        "workingDirectory=@TargetDir@/bleeding");
}
