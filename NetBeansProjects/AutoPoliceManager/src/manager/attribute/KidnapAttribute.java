/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package manager.attribute;

import java.sql.Timestamp;
import java.util.Iterator;
import java.util.Set;

/**
 *
 * @author USER
 */
public class KidnapAttribute {
    
    int serialNo;
    String reporter;
    String captive;
    String incidenceLocation;
    String reportDetails;
    String reporterPhoneNos;
    String detectedReporterLocation;
    String actionTaken = "";
    String imageUrl = "";
    String videoUrl = "";
    Timestamp reportTime;

    public int getSerialNo() {
        return serialNo;
    }

    public void setSerialNo(int serialNo) {
        this.serialNo = serialNo;
    }

    public String getReporter() {
        return reporter;
    }

    public void setReporter(String reporter) {
        this.reporter = reporter;
    }

    public String getCaptive() {
        return captive;
    }

    public void setCaptive(String captive) {
        this.captive = captive;
    }

    public String getIncidenceLocation() {
        return incidenceLocation;
    }

    public void setIncidenceLocation(String incidenceLocation) {
        this.incidenceLocation = incidenceLocation;
    }

    public String getReportDetails() {
        return reportDetails;
    }

    public void setReportDetails(String reportDetails) {
        this.reportDetails = reportDetails;
    }

    public String getReporterPhoneNos() {
        return reporterPhoneNos;
    }

    public void setReporterPhoneNos(String reporterPhoneNos) {
        this.reporterPhoneNos = reporterPhoneNos;
    }

    public String getDetectedReporterLocation() {
        return detectedReporterLocation;
    }

    public void setDetectedReporterLocation(String detectedReporterLocation) {
        this.detectedReporterLocation = detectedReporterLocation;
    }

    public String getActionTaken() {
        return actionTaken;
    }

    public void setActionTaken(String actionTaken) {
        this.actionTaken = actionTaken;
    }

    public Timestamp getReportTime() {
        return reportTime;
    }

    public void setReportTime(Timestamp reportTime) {
        this.reportTime = reportTime;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }
                
    
                
}
