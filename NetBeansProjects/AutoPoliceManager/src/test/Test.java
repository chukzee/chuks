/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;
import java.io.IOException;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import manager.util.SQLColumn;

/**
 *
 * @author ADMIN
 */
public class Test {
    private static Connection local_db_connection;

    public static void main(String args[]) throws MalformedURLException, IOException {
        //test1();
        //test2();
        test3();
    }

    static String arr(String... s) {
        return s[1];
    }

    private static void test1() throws MalformedURLException, IOException {

        System.setProperty("java.net.preferIPv4Stack", "true");
        SQLColumn c = new SQLColumn("DEBIT", 7.0);

        System.out.println(c.getName());
        System.out.println((double) c.getValue());
        System.out.println(new Date(1));
        Calendar cl = Calendar.getInstance();
        System.out.println(cl.getTimeInMillis());
        System.out.println(new Date());
        System.out.println(cl.getTimeInMillis() < new Date().getTime());

        String[] a = {"2", "4", "5", "6"};
        System.out.println(arr("2", "8"));
        System.out.println(arr(a));

        String ftpUrl = "ftp://%s:%s@%s/%s;type=i";
        String host = "localhost";
        String user = "chuks";
        String pass = "chukspass";
        String filePath = "C:\\test\\ng_zone_ds.properties";
        String uploadPath = "css/ng_zone_ds.properties";

        ftpUrl = String.format(ftpUrl, user, pass, host, uploadPath);

        System.out.println(ftpUrl);

        URL url = new URL(ftpUrl);
        URLConnection conn = url.openConnection();
        OutputStream out = conn.getOutputStream();
        out.write("chuks".getBytes());
        out.flush();
        out.close();

    }

    private static void test2() {

    }

    private static void test3() {
        States s = new States();
        s.add("Edo State", "Akoko-Edo\n" +
"Egor\n" +
"Esan Central\n" +
"Esan North-East\n" +
"Esan South-East\n" +
"Esan West\n" +
"Etsako Central\n" +
"Etsako East\n" +
"Etsako West\n" +
"Igueben\n" +
"Ikpoba-Okha\n" +
"Oredo\n" +
"Orhionmwon\n" +
"Ovia North-West\n" +
"Ovia South-West\n" +
"Owan East\n" +
"Owan West\n" +
"Uhunmwonde")
                
                .add("Delta State", "Ethiope East ,\n" +
"Aniocha North ,\n" +
"Bomadi ,\n" +
"Ethiope West ,\n" +
"Aniocha South ,\n" +
"Burutu\n" +
"Okpe ,\n" +
"Ika North East ,\n" +
"Isoko North\n" +
"Sapele\n" +
"Ika South\n" +
"Isoko South\n" +
"Udu\n" +
"Ndokwa East\n" +
"Patani\n" +
"Ughelli North\n" +
"Ndokwa West\n" +
"Warri North\n" +
"Ughelli South\n" +
"Oshimili North\n" +
"Warri South\n" +
"Uvwie\n" +
"Oshimili South\n" +
"Warri South West\n" +
"Ukwuani")
                .add("Lagost State", "Agege\n" +
"Ajeromi-Ifelodun\n" +
"Alimosho\n" +
"Amuwo-Odofin\n" +
"Apapa\n" +
"\n" +
"Eti-Osa\n" +
"\n" +
"Ifako-Ijaiye\n" +
"Ikeja\n" +
"Kosofe\n" +
"Lagos Island\n" +
"\n" +
"Lagos Mainland\n" +
"Mushin\n" +
"Ojo\n" +
"Oshodi-Isolo\n" +
"\n" +
"Somolu\n" +
"Surulere ")
                .add("Ondo State", "Akoko North-East\n" +
"\n" +
"Akoko North-West\n" +
"Akoko South-East\n" +
"Akoko South-West\n" +
"Akure North\n" +
"Akure South\n" +
"Ese Odo\n" +
"Idanre\n" +
"Ifedore\n" +
"Ilaje\n" +
"Ile Oluji/Okeigbo\n" +
"Irele\n" +
"Odigbo\n" +
"Okitipupa\n" +
"Ondo East\n" +
"Ondo West\n" +
"Ose\n" +
"Owo")
                .add("Osun State", "Aiyedaade\n" +
"Aiyedire\n" +
"Atakunmosa East\n" +
"Atakunmosa West\n" +
"Boluwaduro\n" +
"Boripe\n" +
"Ede North\n" +
"Ede South\n" +
"Egbedore\n" +
"Ejigbo\n" +
"Ife Central\n" +
"Ife East\n" +
"Ife North\n" +
"Ife South\n" +
"Ifedayo\n" +
"Ifelodun\n" +
"Ila\n" +
"Ilesa East\n" +
"Ilesa West\n" +
"Irepodun\n" +
"Irewole\n" +
"Isokan\n" +
"Iwo\n" +
"Obokun\n" +
"Odo Otin\n" +
"Ola Oluwa\n" +
"Olorunda\n" +
"Oriade\n" +
"Orolu\n" +
"Osogbo ")
                .add("Ogun State", "Ifo\n" +
"Ado-Odo\n" +
"Ijebu North\n" +
"Shagamu\n" +
"Abeokuta South\n" +
"Obafemi-Owode\n" +
"Abouts North\n" +
"Egbado North\n" +
"Egbado South\n" +
"Ijebu Ode\n" +
"Ipokia\n" +
"Odogbolu\n" +
"Ikenne\n" +
"Odeda\n" +
"Ijebu East\n" +
"Imeko Afon\n" +
"Ogun Waterside\n" +
"Ijebu North East\n" +
"Remo North\n" +
"Ewekoro ")
                .add("Akwa-Ibom State", "Abak\n" +
"\n" +
"Eastern Obolo \n" +
"Eket  \n" +
"Esit-Eket \n" +
" Essien Udim \n" +
" Etim-Ekpo \n" +
" Etinan \n" +
" Ibeno \n" +
" Ibesikpo-Asutan \n" +
"\n" +
"Ibiono-Ibom \n" +
" Ika \n" +
" Ikono \n" +
" Ikot Abasi \n" +
" Ikot Ekpene \n" +
" Ini \n" +
"Itu \n" +
"Mbo \n" +
" Mkpat-Enin \n" +
" Nsit-Atai \n" +
" Nsit-Ibom \n" +
" Nsit-Ubium \n" +
" Obot-Akara\n" +
"\n" +
"Okobo\n" +
"Onna \n" +
"Oron \n" +
"Oruk Anam \n" +
"Ukanafun \n" +
"Udung-Uko \n" +
"Uruan \n" +
"Urue-Offong/Oruko \n" +
"Uyo ")
                .add("Bayelsa State", "Brass\n" +
"Ekeremor\n" +
"Kolokuma/Opokuma\n" +
"Nembe\n" +
"Ogbia\n" +
"Sagbama\n" +
"Southern Ijaw\n" +
"Yenagoa")
                .add("Benue State", "Ado\n" +
"Agatu\n" +
"Apa\n" +
"\n" +
"Buruku\n" +
"\n" +
"Gboko\n" +
"Guma\n" +
"Gwer East\n" +
"Gwer West\n" +
"\n" +
"Katsina-Ala\n" +
"Konshisha\n" +
"Kwande\n" +
"\n" +
"Logo\n" +
"\n" +
"Makurdi\n" +
"\n" +
"Obi\n" +
"Ogbadibo\n" +
"Ohimini\n" +
"Oju\n" +
"Okpokwu\n" +
"Otukpo\n" +
"\n" +
"Tarka\n" +
"\n" +
"Ukum\n" +
"Ushongo\n" +
"\n" +
"Vandeikya")
                .add("Bauchi State", "Bauchi\n" +
"Tafawa Balewa\n" +
"Dass\n" +
"Toro\n" +
"Bogoro\n" +
"Ningi\n" +
"Warji\n" +
"Ganjuwa\n" +
"Kirfi\n" +
"Alkaleri\n" +
"\n" +
"Darazo\n" +
"Misau\n" +
"Giade\n" +
"Shira\n" +
"Jama'are\n" +
"Katagum\n" +
"Itas/Gadau\n" +
"Zaki\n" +
"Gamawa\n" +
"Damban")
                .add("Borno State", "Maiduguri\n" +
"Askira/Uba\n" +
"Abadam\n" +
"Ngala\n" +
"Bayo\n" +
"Gubio\n" +
"Kala/Balge\n" +
"Biu\n" +
"Mafa\n" +
"Chibok\n" +
"Kaga\n" +
"Konduga\n" +
"Damboa\n" +
"Kukawa\n" +
"Bama\n" +
"Gwoza\n" +
"Magumeri\n" +
"Jere\n" +
"Hawul\n" +
"Marte\n" +
"Dikwa\n" +
"Kwaya Kusar\n" +
"Mobbar\n" +
"Shani\n" +
"Monguno\n" +
"Nganzai\n" +
"Guzamala")
                .add("Abia State", "Aba North\n" +
"Aba South\n" +
"Arochukwu\n" +
"Bende\n" +
"Ikwuano\n" +
"Isiala Ngwa North\n" +
"Isiala Ngwa South\n" +
"Isuikwuato\n" +
"Obi Ngwa\n" +
"Ohafia\n" +
"Osisioma Ngwa\n" +
"Ugwunagbo\n" +
"Ukwa East\n" +
"Ukwa West\n" +
"Umuahia North\n" +
"Umuahia South\n" +
"Umu Nneochi\n" +
"Traditional rulers")
                .add("Anambra State",
                        //"A\n" +//makes no sense
"Aguata\n" +
"Anambra East\n" +
"Anambra West\n" +
"Anaocha\n" +
"Awka North\n" +
"Awka South\n" +
"Ayamelum\n" +
//"D\n" +//makes no sense
"Dunukofia\n" +
//"E\n" +//makes no sense
"Ekwusigo\n" +
//"I\n" +//makes no sense
"Idemili North\n" +
"Idemili South\n" +
"Ihiala\n" +
//"N\n" +//makes no sense
"Njikoka\n" +
"Nnewi North\n" +
"Nnewi South\n" +
//"O\n" +//makes no sense
"Ogbaru\n" +
"Onitsha North\n" +
"Onitsha South\n" +
"Orumba North\n" +
"Orumba South\n" +
"Oyi")
                .add("Cross River State", "Abi\n" +
"Akamkpa\n" +
"Akpabuyo\n" +
"Bakassi\n" +
"Bekwarra\n" +
"Biase\n" +
"Boki\n" +
"Calabar Municipal\n" +
"Calabar South\n" +
"Etung\n" +
"Ikom\n" +
"Obanliku\n" +
"Obubra\n" +
"Obudu\n" +
"Odukpani\n" +
"Ogoja\n" +
"Yakuur\n" +
"Yala")
                .add("Adamawa State", "Demsa\n" +
"Fufore\n" +
"Ganye\n" +
"Girei\n" +
"Gombi\n" +
"Guyuk\n" +
"Hong\n" +
"Jada\n" +
"Lamurde\n" +
"Madagali\n" +
"Maiha\n" +
"Mayo-Belwa\n" +
"Michika\n" +
"Mubi North\n" +
"Mubi South\n" +
"Numan\n" +
"Shelleng\n" +
"Song\n" +
"Toungo\n" +
"Yola North\n" +
"Yola South")
                .add("Yobe State", "Bursari\n" +
"Damaturu\n" +
"Geidam\n" +
"Bade\n" +
"Gujba\n" +
"Gulani\n" +
"Fika\n" +
"Fune\n" +
"Jakusko\n" +
"Karasuwa\n" +
"Machina\n" +
"Nangere\n" +
"Nguru\n" +
"Potiskum\n" +
"Tarmuwa\n" +
"Yunusari\n" +
"Yusufari")
                .add("Oyo State", "Akinyele Moniya\n" +
"Afijio Jobele\n" +
"Egbeda Egbeda\n" +
"Ibadan North Agodi Gate\n" +
"Ibadan North-East Iwo Road\n" +
"Ibadan North-West\n" +
"Ibadan South-West Ring Road\n" +
"Ibadan South-East Mapo\n" +
"Ibarapa Central\n" +
"Ibarapa East Eruwa\n" +
"Ido\n" +
"Irepo\n" +
"Iseyin Iseyin\n" +
"Kajola\n" +
"Lagelu\n" +
"Ogbomosho North\n" +
"Ogbomosho South\n" +
"Oyo West Ojongbodu\n" +
"Atiba Ofa Meta\n" +
"Atisbo Tede\n" +
"Saki West\n" +
"Saki East\n" +
"Itesiwaju Otu\n" +
"Iwajowa\n" +
"Ibarapa North\n" +
"Olorunsogo\n" +
"Oluyole\n" +
"Ogo Oluwa\n" +
"Surulere\n" +
"Orelope\n" +
"Ori Ire\n" +
"Oyo East\n" +
"Ona Ara")
                .add("Kano State", "Fagge\n" +
"\n" +
"Dala\n" +
"Gwale\n" +
"Kano Municipal\n" +
"\n" +
"Tarauni\n" +
"\n" +
"Nassarawa\n" +
"\n" +
"Kumbotso\n" +
"Ungogo\n" +
"\n" +
"Dawakin Tofa\n" +
"Tofa\n" +
"Rimin Gado\n" +
"Bagwai\n" +
"Gezawa\n" +
"Gabasawa\n" +
"\n" +
"Minjibir\n" +
"Dambatta\n" +
"Makoda\n" +
"Kunchi\n" +
"Bichi\n" +
"Tsanyawa\n" +
"Shanono\n" +
"Gwarzo\n" +
"Karaye\n" +
"Rogo\n" +
"Kabo\n" +
"Bunkure\n" +
"Kibiya\n" +
"Rano\n" +
"Tudun Wada\n" +
"Doguwa\n" +
"\n" +
"Madobi\n" +
"Kura\n" +
"Garun Mallam\n" +
"Bebeji\n" +
"Kiru\n" +
"Sumaila\n" +
"Garko\n" +
"Takai\n" +
"Albasu\n" +
"Gaya\n" +
"Ajingi\n" +
"Wudil\n" +
"Warawa\n" +
"Dawakin Kudu")
                .add("Enugu State", "Aninri\n" +
"Awgu\n" +
"Enugu East\n" +
"Enugu North\n" +
"Enugu South\n" +
"Ezeagu\n" +
"Igbo Etiti\n" +
"Igbo Eze North\n" +
"Igbo Eze South\n" +
"Isi Uzo\n" +
"Nkanu East\n" +
"Nkanu West\n" +
"Nsukka\n" +
"Oji River\n" +
"Udenu\n" +
"Udi\n" +
"Uzo Uwani")
                .add("Abia State", "Aba North\n" +
"Aba South\n" +
"Arochukwu\n" +
"Bende\n" +
"Ikwuano\n" +
"Isiala Ngwa North\n" +
"Isiala Ngwa South\n" +
"Isuikwuato\n" +
"Obi Ngwa\n" +
"Ohafia\n" +
"Osisioma Ngwa\n" +
"Ugwunagbo\n" +
"Ukwa East\n" +
"Ukwa West\n" +
"Umuahia North\n" +
"Umuahia South\n" +
"Umu Nneochi")
                .add("Imo State", "Aboh Mbaise\n" +
"Ahiazu Mbaise\n" +
"Ehime Mbano\n" +
"Ezinihitte Mbaise\n" +
"Ideato North\n" +
"Ideato South\n" +
"Ihitte/Uboma\n" +
"Ikeduru\n" +
"Isiala Mbano\n" +
"Isu\n" +
"Mbaitoli\n" +
"Ngor Okpala\n" +
"Njaba\n" +
"Nkwerre\n" +
"Nwangele\n" +
"Obowo\n" +
"Oguta\n" +
"Ohaji/Egbema\n" +
"Okigwe\n" +
"Onuimo\n" +
"Orlu\n" +
"Orsu\n" +
"Oru East\n" +
"Oru West\n" +
"Owerri Municipal\n" +
"Owerri North\n" +
"Owerri West")
                .add("Kaduna State", "Birnin Gwari\n" +
"Chikun\n" +
"Giwa\n" +
"Igabi\n" +
"Ikara\n" +
"Jaba\n" +
"Jema'a\n" +
"Kachia\n" +
"Kaduna North\n" +
"Kaduna South\n" +
"Kagarko\n" +
"Kajuru\n" +
"Kaura\n" +
"Kauru\n" +
"Kubau\n" +
"Kudan\n" +
"Lere\n" +
"Makarfi\n" +
"Sabon Gari\n" +
"Sanga\n" +
"Soba\n" +
"Zangon Kataf\n" +
"Zaria")
                .add("Sokoto State", "Binji\n" +
"Bodinga\n" +
"Dange Shuni\n" +
"Gada\n" +
"Goronyo\n" +
"Gudu\n" +
"Gwadabawa\n" +
"Illela\n" +
"Isa\n" +
"Kebbe\n" +
"Kware\n" +
"Rabah\n" +
"Sabon Birni\n" +
"Shagari\n" +
"Silame\n" +
"Sokoto North\n" +
"Sokoto South\n" +
"Tambuwal\n" +
"Tangaza\n" +
"Tureta\n" +
"Wamako\n" +
"Wurno\n" +
"Yabo")
                .add("Zamfara State", "Anka\n" +
"Bakura\n" +
"Birnin Magaji/Kiyaw\n" +
"Bukkuyum\n" +
"Bungudu\n" +
"Chafe\n" +
"Gummi\n" +
"Gusau\n" +
"Kaura Namoda\n" +
"Maradun\n" +
"Maru\n" +
"Shinkafi\n" +
"Talata Mafara\n" +
"Zurmi")
                .add("Kebbi State ", "Aleiro\n" +
"Arewa Dandi\n" +
"Argungu\n" +
"Augie\n" +
"Bagudo\n" +
"Birnin Kebbi\n" +
"Bunza\n" +
"Dandi\n" +
"Fakai\n" +
"Gwandu\n" +
"Jega\n" +
"Kalgo\n" +
"Koko/Besse\n" +
"Maiyama\n" +
"Ngaski\n" +
"Sakaba\n" +
"Shanga\n" +
"Suru\n" +
"Wasagu/Danko\n" +
"Yauri\n" +
"Zuru")
                .add("Gombe State", "Akko\n" +
"Balanga\n" +
"Billiri\n" +
"Dukku\n" +
"Funakaye\n" +
"Gombe\n" +
"Kaltungo\n" +
"Kwami\n" +
"Nafada\n" +
"Shongom\n" +
"Yamaltu/Deba")
                .add("Kogi State", "Adavi\n" +
"Ajaokuta\n" +
"Ankpa\n" +
"Bassa\n" +
"Dekina\n" +
"Ibaji\n" +
"Idah\n" +
"Igalamela-Odolu\n" +
"Ijumu\n" +
"Kabba/Bunu\n" +
"Koton Karfe\n" +
"Lokoja\n" +
"Mopa-Muro\n" +
"Ofu\n" +
"Ogori/Magongo\n" +
"Okehi\n" +
"Okene\n" +
"Olamaboro\n" +
"Omala\n" +
"Yagba East\n" +
"Yagba West")
                .add("Nasarawa State", "Karu\n" +
"Akwanga\n" +
"Awe\n" +
"Keffi\n" +
"Nasarawa Egon\n" +
"Doma\n" +
"Kokona\n" +
"Wamba\n" +
"Keana\n" +
"Nasarawa\n" +
"Lafia")
                .add("Ekiti State", "Ado-Ekiti\n" +
"Oye\n" +
"Aiyekire (Gbonyin)\n" +
"Efon\n" +
"Ekiti East\n" +
"Ekiti South-West\n" +
"Ekiti West\n" +
"Emure\n" +
"Ido-Osi\n" +
"Ijero\n" +
"Ikere\n" +
"Ikole\n" +
"Ilejemeje\n" +
"Irepodun/Ifelodun\n" +
"Ise/Orun\n" +
"Moba")
                .add("Ebonyi State", "Abakaliki\n" +
"Afikpo North\n" +
"Afikpo South\n" +
"Ebonyi\n" +
"Ezza North\n" +
"Ezza South\n" +
"Ikwo\n" +
"Ishielu\n" +
"Ivo\n" +
"Izzi\n" +
"Ohaozara\n" +
"Ohaukwu\n" +
"Onicha")
                .add("Plateau State", "Barkin Ladi\n" +
"Bassa\n" +
"Bokkos\n" +
"Jos East\n" +
"Jos North\n" +
"Jos South\n" +
"Kanam\n" +
"Kanke\n" +
"Langtang North\n" +
"Langtang South\n" +
"Mangu\n" +
"Mikang\n" +
"Pankshin\n" +
"Qua'an Pan\n" +
"Riyom\n" +
"Shendam\n" +
"Wase")
                .add("Jigawa State", "Auyo\n" +
"Babura\n" +
"Biriniwa\n" +
"Birnin Kudu\n" +
"Buji\n" +
"Dutse\n" +
"Gagarawa\n" +
"Garki\n" +
"Gumel\n" +
"Guri\n" +
"Gwaram\n" +
"Gwiwa\n" +
"Hadejia\n" +
"Jahun\n" +
"Kafin Hausa\n" +
"Kaugama\n" +
"Kazaure\n" +
"Kiri Kasama\n" +
"Kiyawa\n" +
"Maigatari\n" +
"Malam Madori\n" +
"Miga\n" +
"Ringim\n" +
"Roni\n" +
"Sule Tankarkar\n" +
"Taura\n" +
"Yankwashi")
                .add("Kwara State", "Asa\n" +
"Baruten\n" +
"Edu\n" +
"Ekiti\n" +
"Ifelodun\n" +
"Ilorin East\n" +
"Ilorin South\n" +
"Ilorin West\n" +
"Irepodun\n" +
"Isin\n" +
"Kaiama\n" +
"Moro\n" +
"Offa\n" +
"Oke Ero\n" +
"Oyun\n" +
"Pategi")
                .add("Niger State", "Agaie\n" +
"Agwara\n" +
"Bida\n" +
"Borgu\n" +
"Bosso\n" +
"Chanchaga\n" +
"Edati\n" +
"Gbako\n" +
"Gurara\n" +
"Katcha\n" +
"Kontagora\n" +
"Lapai\n" +
"Lavun\n" +
"Magama\n" +
"Mariga\n" +
"Mashegu\n" +
"Mokwa\n" +
"Munya\n" +
"Paikoro\n" +
"Rafi\n" +
"Rijau\n" +
"Shiroro\n" +
"Suleja\n" +
"Tafa\n" +
"Wushishi\n" +
"Toto\n" +
"Obi ")
                .add("Taraba State", "Ardo Kola\n" +
"Bali\n" +
"Donga\n" +
"Gashaka\n" +
"Gassol\n" +
"Ibi\n" +
"Jalingo\n" +
"Karim Lamido\n" +
"Kurmi\n" +
"Lau\n" +
"Sardauna\n" +
"Takum\n" +
"Ussa\n" +
"Wukari\n" +
"Yorro\n" +
"Zing")
                .add("", "");

        System.out.println(s.get());
        
        
        /*
        try {
            connectToDB();
            
        Statement stmt = local_db_connection.createStatement();
        
            
            String [] sp = s.state_lga.split("\n");
            for(int i=0; i<sp.length; i++){
                String[] sl = sp[i].split("=");
                String st = sl[0];
                String lg = sl[1];
                String[] lgs = lg.split(",");
                for(int k=0; k<lgs.length; k++){                
                    stmt.executeUpdate("INSERT INTO states_and_lgas VALUES('"+st+"','"+lgs[k]+"')");                
                }
            }
        
        
        } catch (SQLException ex) {
            Logger.getLogger(Test.class.getName()).log(Level.SEVERE, null, ex);
        }
        
        */
    }

    static class States {

        private String state_lga = "";
        private HashMap map= new HashMap();
        
        public States add(String state, String lgas) {
            if(state.isEmpty()|| lgas.isEmpty())
                return this;
            
            String l = "";
            while (!lgas.equals(l)) {
                lgas = lgas.replaceAll("'", " ");
                l = lgas.replaceAll("'", " ");
            }
            
             l = "";
            while (!lgas.equals(l)) {
                lgas = lgas.replaceAll("  ", " ");
                l = lgas.replaceAll("  ", " ");
            }
            
            lgas = lgas.replaceAll("\r", ",");
            lgas = lgas.replaceAll("\n", ",");
            l = "";
            while (!lgas.equals(l)) {
                lgas = lgas.replaceAll(",,", ",");
                l = lgas.replaceAll(",,", ",");
            }

            String[] arr = lgas.split(",");
            l = "";
            for (int i = 0; i < arr.length; i++) {
                arr[i] = arr[i].substring(0, 1).toUpperCase() + arr[i].substring(1);
                l += i < arr.length - 1 ? arr[i] + "," : arr[i];
            }

            lgas = l;

            state_lga += state + "=" + lgas + "\n";
            
            l = "";
            while (!lgas.equals(l)) {
                state_lga = state_lga.replaceAll(" ,", ",");
                l = lgas.replaceAll("  ", " ");
            }
            
            l = "";
            while (!lgas.equals(l)) {
                state_lga = state_lga.replaceAll(", ", ",");
                l = lgas.replaceAll("  ", " ");
            }
            
            
            String [] sp = state_lga.split("\n");
            
            for(int i=0; i<sp.length; i++){
                String[] sl = sp[i].split("=");
                String st = sl[0];
                String lg = sl[1];
                this.map.put(st, lg);
            }
            
            return this;
        }

        public String get() {
            return state_lga;
        }
    }
    
    
    public static boolean connectToDB() throws SQLException {

        MysqlDataSource ds = new MysqlDataSource();
        ds.setServerName("45.79.137.25");
        ds.setPort(3306);
        ds.setDatabaseName("autopolicedb");
        ds.setUser("centralnipol");
        ds.setPassword("centralnipolpass");

        local_db_connection = (Connection) ds.getConnection();

        return local_db_connection != null;
    }

}
