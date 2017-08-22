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
abstract public class BaseObj {
    
    Obj absolute;
    Obj app;
    Obj small;
    Obj medium;
    Obj large;

    public Obj getAbsolute() {
        return absolute == null? absolute = new Obj (): absolute;
    }

    public void setAbsolute(Obj absolute) {
        this.absolute = absolute;
    }

    public Obj getApp() {
        return app == null? app = new Obj (): app;
    }

    public void setApp(Obj app) {
        this.app = app;
    }

    public Obj getSmall() {
        return small == null? small = new Obj (): small;
    }

    public void setSmall(Obj small) {
        this.small = small;
    }

    public Obj getMedium() {
        return medium == null? medium = new Obj (): medium;
    }

    public void setMedium(Obj medium) {
        this.medium = medium;
    }

    public Obj getLarge() {
        return large == null? large = new Obj (): large;
    }

    public void setLarge(Obj large) {
        this.large = large;
    }
    
    
}
