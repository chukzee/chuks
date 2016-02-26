/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.info;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author USER
 */
public class TournamentInfo implements Serializable{

    String tournamentName;
    long date_created;
    String createdBy;
    List<MatchSchedule> schedules = new ArrayList();

    private TournamentInfo() {
    }

    public TournamentInfo(String tournamentName) {
        this.tournamentName = tournamentName;
    }

    public String getTournamentName() {
        return tournamentName;
    }

    public long getDateCreated() {
        return date_created;
    }

    public void setDateCreated(long date_created) {
        this.date_created = date_created;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public List<MatchSchedule> getMatchSchedules() {
        return schedules;
    }

    public void setMatchSchedules(List<MatchSchedule> schedules) {
        this.schedules = schedules;
    }

    public void addMatchSchedule(MatchSchedule schedule) {
        this.schedules.add(schedule);
    }

    public void removeMatchSchedule(String gameId) {
        for (int i = 0; i < schedules.size(); i++) {
            if (schedules.get(i).getGameInfo().getGameId().equals(gameId)) {
                this.schedules.remove(i);
            }
        }
    }

}
