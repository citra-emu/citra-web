function Component() {
    if (systemInfo.kernelType === "linux") {
        component.setValue("Virtual", "false");
        component.setValue("Default", "false"); // Bleeding
    } else {
        component.setValue("Virtual", "true");
        component.setValue("Enabled", "false");
    }
}

Component.prototype.createOperations = function()
{
    component.createOperations();

    component.addOperation("CreateDesktopEntry", "citra-bleeding-edge.desktop",
    "Version=1.0" +
    "Type=Application" +
    "Name=Citra Bleeding Edge" +
    "GenericName=3DS Emulator" +
    "GenericName[fr]=Émulateur 3DS" +
    "Comment=Nintendo 3DS video game console emulator" +
    "Comment[fr]=Émulateur de console de jeu Nintendo 3DS" +
    "Icon=citra" +
    "TryExec=@TargetDir@/bleeding/citra-qt" +
    "Exec=@TargetDir@/bleeding/citra-qt %f" +
    "Categories=Game;Emulator;Qt;" +
    "MimeType=application/x-ctr-3dsx;application/x-ctr-cci;application/x-ctr-cia;application/x-ctr-cxi;" +
    "Keywords=3DS;Nintendo;");
}
