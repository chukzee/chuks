package naija.games;

import naija.games.gui.MainController;
import com.jme3.app.SimpleApplication;
import com.jme3.math.ColorRGBA;
import com.jme3.niftygui.NiftyJmeDisplay;
import com.jme3.system.AppSettings;
import de.lessvoid.nifty.Nifty;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.Rectangle;
import naija.game.client.AbstractGameClientFactory;
import naija.game.client.GameClient;
import naija.game.client.ClientFactory;
import naija.game.client.FacebookSocialNetwork;
import naija.game.client.Game;
import naija.game.client.GameName;
import naija.game.client.GameSession;
import naija.game.client.IConnection;
import naija.game.client.LocalGameSession;
import naija.game.client.LocalUser;
import naija.game.client.Player;
import naija.game.client.Score;
import naija.game.client.TwitterSocialNetwork;
import naija.game.client.User;
import naija.game.client.WebConnection;
import naija.game.client.event.GameSessionEvent;
import naija.game.client.event.GameSessionListener;
import org.lwjgl.opengl.Display;

/**
 * test
 *
 * @author normenhansen
 */
public abstract class AbstractGameMain
        extends SimpleApplication
        implements GameSessionListener {

    private static double device_width;
    private static double device_height;
    private static int window_width;
    private static int window_height;
    private static int window_x_loc;
    private static int window_y_loc;
    private MainController mainController;
    private GameClient gclient;
    private WebConnection webConn;
    protected Game current_game;
    protected LocalUser localUser;

    public AbstractGameMain() {
        AppSettings _settings = new AppSettings(true);
        _settings.setRenderer(AppSettings.LWJGL_OPENGL1);

        double w_scale = 0.9;
        double h_scale = 0.85;
        configWindowBounds(w_scale, h_scale);
        _settings.setWidth(window_width);
        _settings.setHeight(window_height);
        Display.setLocation(window_x_loc, window_y_loc);
        //Display.setResizable(true);//I WILL NOT USE RESIZABLE


        setShowSettings(false);//don't show show dialog

        setDisplayStatView(false);//don't display statistics on scene
        setDisplayFps(false);//don't display frame per sec on scene

        setSettings(_settings);

        start();

    }

    private static void configWindowBounds(double w_scale, double h_scale) {

        GraphicsEnvironment ge = GraphicsEnvironment.
                getLocalGraphicsEnvironment();
        GraphicsDevice gd = ge.getDefaultScreenDevice();
        Rectangle bounds = gd.getDefaultConfiguration().getBounds();

        device_width = bounds.getWidth();
        device_height = bounds.getHeight();
        window_width = (int) (w_scale * device_width);
        window_height = (int) (h_scale * device_height);
        window_x_loc = (int) (device_width - window_width) / 2;
        window_y_loc = 20;//good position
    }

    @Override
    public void simpleInitApp() {

        mainController = new MainController();
        stateManager.attach(mainController);

        NiftyJmeDisplay niftyDisplay = new NiftyJmeDisplay(assetManager, inputManager, audioRenderer, guiViewPort);

        Nifty nifty = niftyDisplay.getNifty();

        guiViewPort.addProcessor(niftyDisplay);
        nifty.fromXml("Interface/MainLayout.xml", "start", mainController);

        //nifty.setDebugOptionPanelColors(true);

        viewPort.setBackgroundColor(ColorRGBA.LightGray);

        flyCam.setDragToRotate(true);

        createGameClient();

        startupGameView();

    }

    public GameClient getGameClient() {
        return gclient;
    }

    public Game getCurrentGame() {
        return current_game;
    }

    protected void createGameClient() {

        webConn = new WebConnection(ClientConfig.host, ClientConfig.port);//using internet connection   
        AbstractGameClientFactory gcFac = getGameClientFactory(webConn);
        gclient = ClientFactory.createGameClient(gcFac);

        //add social networks
        String token = ClientConfig.facebook_token;//acces token value
        long exipry = ClientConfig.facebook_expiry;//access token expiry time
        gclient.addSocailNetwork(new FacebookSocialNetwork(token, exipry));

        token = ClientConfig.twitter_token;//acces token value
        String secret = ClientConfig.twitter_secret;//access token secret
        long userDd = ClientConfig.twitter_user_id;//the authenitcating user id
        gclient.addSocailNetwork(new TwitterSocialNetwork(token, secret, userDd));

        //add listeners
        gclient.addGameSessionListener(this);

        //start the game client - it is safe to start here is network process run in backgroud threads
        gclient.start();//start the game client - client connects and starts internal processing

    }

    final public void startupGameView() {
        LocalGameSession locaGameSession = new LocalGameSession(getGameName(),
                geDefaultLocalPlayer(), getDefaultRobotPlayer(),
                getDefaultTimeControl(), getDefaultScore(),
                getDefaultGamePosition(), getDefaultGameVariant());

        gclient.addSession(locaGameSession);//add this session to the game client
        showGame(locaGameSession);
    }

    final public void showGame(GameSession session) {
        current_game = buildGame(session, buildGameView(session));
    }

    public abstract Game buildGame(GameSession gameSession, Game3DView gameView);

    public abstract Game3DView buildGameView(GameSession gameSession);

    public abstract AbstractGameClientFactory getGameClientFactory(IConnection conn);

    public abstract GameName getGameName();

    public abstract Player geDefaultLocalPlayer();

    public abstract Player getDefaultRobotPlayer();

    public abstract String getDefaultTimeControl();

    public abstract Score getDefaultScore();

    public abstract String getDefaultGamePosition();

    public abstract int getDefaultGameVariant();

    /**f
     * Subclass should implement this method to update the
     * game position of the current game in view.
     * @param event 
     */
    public abstract void updateGamePosition(GameSessionEvent event);

    @Override
    public void onSessionGameStarts(GameSessionEvent event) {
        
    }

    @Override
    public void onSessionGameEnds(GameSessionEvent event) {
        
    }

    @Override
    public void onSessionGameResume(GameSessionEvent event) {
    }

    final public void onSessionGameUpdate(GameSessionEvent event) {
        if (!event.getSessionID().equals(current_game.getSessionID())) {
            return;
        }
        if (event.geMoveNotation() == null) {
            return;
        }
        
        //At this point it is a move event 

        //check if the local user move was sent by the server. this can happen when move update request is sent by the client
        if(event.getPlayerWhoMoved().sameAs(localUser)){
            return;//no need to play this move. local user moves are played before being sent to the server.
        }

        
        //At this point it is a move event of the local user opponent or a remote player

        updateGamePosition(event);
    }

    @Override
    public void onSessionSpecatorJoin(GameSessionEvent event) {
        
    }

    @Override
    public void onSessionSpectatorLeave(GameSessionEvent event) {
        
    }
}
