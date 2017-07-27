function Component() {
    if (systemInfo.kernelType === "darwin") {
        component.setValue("Virtual", "false");
        component.setValue("Default", "true");
    } else {
        component.setValue("Virtual", "true");
        component.setValue("Enabled", "false");
    }
}

Component.prototype.createOperations = function()
{
    component.createOperations();
}
