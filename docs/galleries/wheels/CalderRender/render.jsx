/* Calder Wheels Photoshop batch renderer (ExtendScript ES3 compatible).
   Run via Photoshop > File > Scripts > Browse.
   Requires jobs.json created by build_jobs.py and calibrated master PSDs.
*/
(function () {
    var originalDialogs = app.displayDialogs;
    var doc = null;
    var activeMaster = "";
    var completed = 0;
    var failures = [];
    var jobFile = null;

    function readJobs(file) {
        if (!file.open("r")) throw new Error("Cannot open jobs.json: " + file.fsName);
        var raw = file.read();
        file.close();
        // ExtendScript versions do not consistently provide JSON.parse.
        var data = (typeof JSON !== "undefined" && JSON.parse) ? JSON.parse(raw) : eval("(" + raw + ")");
        if (!data || !data.jobs || typeof data.jobs.length !== "number") {
            throw new Error("jobs.json must contain a jobs array.");
        }
        return data.jobs;
    }

    function findTopLevelGroup(document, name) {
        for (var i = 0; i < document.layerSets.length; i++) {
            if (document.layerSets[i].name === name) return document.layerSets[i];
        }
        throw new Error("Missing top-level layer group: " + name);
    }

    function selectLayer(group, selectedName) {
        var target = null;
        for (var i = 0; i < group.artLayers.length; i++) {
            if (group.artLayers[i].name === selectedName) target = group.artLayers[i];
        }
        if (!target) throw new Error("Missing layer '" + selectedName + "' in group '" + group.name + "'");
        group.visible = true;
        for (var j = 0; j < group.artLayers.length; j++) {
            group.artLayers[j].visible = (group.artLayers[j].name === selectedName);
        }
    }

    function savePNG(document, outputPath) {
        var out = new File(outputPath);
        if (!out.parent.exists && !out.parent.create()) {
            throw new Error("Cannot create output folder: " + out.parent.fsName);
        }
        var options = new PNGSaveOptions();
        options.interlaced = false;
        document.saveAs(out, options, true, Extension.LOWERCASE);
    }

    function writeLog(folder, total) {
        var log = new File(folder.fsName + "/render-log.txt");
        if (log.open("w")) {
            log.writeln("Completed: " + completed + " / " + total);
            for (var i = 0; i < failures.length; i++) log.writeln(failures[i]);
            log.close();
        }
    }

    try {
        jobFile = File.openDialog("Select Calder jobs.json", "JSON files:*.json");
        if (!jobFile) return;
        var jobs = readJobs(jobFile);
        app.displayDialogs = DialogModes.NO;
        for (var n = 0; n < jobs.length; n++) {
            var job = jobs[n];
            try {
                if (!job.master || !job.output || !job.center || !job.barrel || !job.hardware) {
                    throw new Error("Incomplete job fields");
                }
                if (activeMaster !== job.master) {
                    if (doc) { doc.close(SaveOptions.DONOTSAVECHANGES); doc = null; }
                    var masterFile = new File(job.master);
                    if (!masterFile.exists) throw new Error("Missing PSD: " + job.master);
                    doc = app.open(masterFile);
                    activeMaster = job.master;
                }
                selectLayer(findTopLevelGroup(doc, "CENTER"), job.center);
                selectLayer(findTopLevelGroup(doc, "BARREL"), job.barrel);
                selectLayer(findTopLevelGroup(doc, "HARDWARE"), job.hardware);
                savePNG(doc, job.output);
                completed++;
            } catch (jobError) {
                failures.push("Job " + (n + 1) + " (" + (job.output || "unknown") + "): " + jobError.toString());
            }
        }
        writeLog(jobFile.parent, jobs.length);
        alert("Calder rendering complete: " + completed + " / " + jobs.length + " PNGs.\nSee render-log.txt for details.");
    } catch (error) {
        alert("Calder render error: " + error.toString());
    } finally {
        if (doc) { try { doc.close(SaveOptions.DONOTSAVECHANGES); } catch (ignore) {} }
        app.displayDialogs = originalDialogs;
    }
})();
