\
#target photoshop
/*
  Photoshop ExtendScript. Browse to jobs.json when prompted.
  Master PSD must have groups CENTER, BARREL, HARDWARE.
  Each group contains exact named layers, e.g. disk-ti, barrel-gbl, 24pcs-ch.
  FRONT_LIP (if present) stays visible as authored.
*/
(function () {
  var oldDialogs = app.displayDialogs;
  app.displayDialogs = DialogModes.NO;
  try {
    var f = File.openDialog("Select jobs.json", "*.json");
    if (!f) return;
    if (!f.open("r")) throw Error("Cannot read jobs file");
    var payload = f.read(); f.close();
    var jobs = JSON.parse(payload).jobs;
    var failures = [], completed = 0, doc = null, activeMaster = "";
    function findGroup(doc, name) {
      for (var i=0;i<doc.layerSets.length;i++)
        if (doc.layerSets[i].name===name) return doc.layerSets[i];
      throw Error("Missing layer group: "+name);
    }
    function select(group, layerName) {
      var found = false;
      for (var i=0;i<group.artLayers.length;i++) {
        var layer=group.artLayers[i];
        layer.visible=(layer.name===layerName);
        if(layer.visible) found=true;
      }
      if (!found) throw Error("Missing layer "+layerName+" in "+group.name);
    }
    for (var j=0;j<jobs.length;j++) {
      var job=jobs[j];
      try {
        if (activeMaster!==job.master) {
          if (doc) doc.close(SaveOptions.DONOTSAVECHANGES);
          doc=app.open(File(job.master)); activeMaster=job.master;
        }
        select(findGroup(doc,"CENTER"),job.center);
        select(findGroup(doc,"BARREL"),job.barrel);
        select(findGroup(doc,"HARDWARE"),job.hardware);
        var out=File(job.output);
        if (!out.parent.exists) out.parent.create();
        var png = new PNGSaveOptions();
        png.interlaced=false;
        doc.saveAs(out,png,true,Extension.LOWERCASE);
        completed++;
      } catch (e) { failures.push(job.output+" : "+e.toString()); }
    }
    if (doc) doc.close(SaveOptions.DONOTSAVECHANGES);
    var log=File(f.parent.fsName+"/render-log.txt");
    if(log.open("w")) {
      log.writeln("Completed: "+completed+" / "+jobs.length);
      for(var k=0;k<failures.length;k++) log.writeln(failures[k]);
      log.close();
    }
    alert("Rendered "+completed+" / "+jobs.length+" images. See render-log.txt.");
  } catch (e) { alert("Render error: "+e.toString()); }
  finally { app.displayDialogs=oldDialogs; }
})();
