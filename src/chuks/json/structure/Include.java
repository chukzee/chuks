/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.json.structure;

/**
 *
 * @author USER
 */
public class Include extends BaseObj{
    private String app_name = "";
    private String namespace = "";
    private BuildObj build = new BuildObj();
        
    public String getAppName() {
        return app_name;
    }

    public void setAppName(String app_name) {
        this.app_name = app_name;
    }

    public String getNamespace() {
        return namespace;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    public BuildObj getBuild() {
        return build;
    }

    public void setBuild(BuildObj build) {
        this.build = build;
    }
}
