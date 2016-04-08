/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

/**
 *
 * @author USER
 */
abstract public class AbstractPlayer<E extends GameAnalyzer, T extends GameMove> implements Player {

    private LocalUser local_user;
    private RemoteUser remote_user;
    private Robot robot;

    private AbstractPlayer() {
    }

    public AbstractPlayer(LocalUser local_user) {
        this.local_user = local_user;
    }

    public AbstractPlayer(RemoteUser remote_user) {
        this.remote_user = remote_user;
    }

    public AbstractPlayer(Robot robot) {
        this.robot = robot;
    }

    @Override
    public User getInfo() {
        if (local_user != null) {
            return local_user.getInfo();
        }

        if (remote_user != null) {
            return remote_user.getInfo();
        }

        return null;
    }

    @Override
    public boolean isHuman() {
        return robot == null;
    }

    @Override
    public boolean isRobot() {
        return robot != null;
    }

    @Override
    public boolean isRemotePlayer() {
        return remote_user != null;
    }

    @Override
    public boolean isLocalPlayer() {
        return local_user != null;
    }

    @Override
    public boolean sameAs(User user) {
        return this.getInfo() != null && this.getInfo().getUsername().equals(user.getUsername());
    }

    @Override
    public boolean sameAs(Player player) {
        if (player.getInfo() == null) {
            return false;
        }
        return this.getInfo() != null && this.getInfo().getUsername().equals(player.getInfo().getUsername());
    }
}
