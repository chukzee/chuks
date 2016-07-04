/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ComputerID {

    public static void main(String[] args) throws Throwable {

        System.out.println(getID());
        //System.out.println(getBiosSerialNumber());
        
        
    }
    
    public static String getID(){
        OsCheck.OSType ostype=OsCheck.getOperatingSystemType();
        switch (ostype) {
            case Windows: return WindowOsSerialNumber();
            case MacOS: return MacOsSerialNumber();
            case Linux: return LinuxOsSerialNumber();
            case Other: return "";//not supported
        }
        
        return "";
    }

    private static String WindowOsSerialNumber(){
        String serial = "";

        if(!(serial=getBiosSerialNumber()).isEmpty())
            return serial;
        else if(!(serial=getDiskSerialNumber()).isEmpty())
            return serial;
        else if(!(serial=getUUID()).isEmpty() && !serial.equals("FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF"))
            return serial;        
        
        return serial;
    }
	
    private static String MacOsSerialNumber() {
                String sn = null;
		if (sn != null) {
			return sn;
		}

		OutputStream os = null;
		InputStream is = null;

		Runtime runtime = Runtime.getRuntime();
		Process process = null;
		try {
			process = runtime.exec(new String[] { "/usr/sbin/system_profiler", "SPHardwareDataType" });
		} catch (IOException e) {
			throw new RuntimeException(e);
		}

		os = process.getOutputStream();
		is = process.getInputStream();

		try {
			os.close();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}

		BufferedReader br = new BufferedReader(new InputStreamReader(is));
		String line = null;
		String marker = "Serial Number:";
		try {
			while ((line = br.readLine()) != null) {
				if (line.indexOf(marker) != -1) {
					sn = line.split(marker)[1].trim();
					break;
				}
			}
		} catch (IOException e) {
			throw new RuntimeException(e);
		} finally {
			try {
				is.close();
			} catch (IOException e) {
				throw new RuntimeException(e);
			}
		}

		if (sn == null) {
			throw new RuntimeException("Cannot find computer SN");
		}

		return sn;
	}
        
    private static  String getBiosSerialNumber(){
        InputStream in = null;
        try {
            Process process = Runtime.getRuntime().exec(new String[] { "wmic", "bios", "get", "serialnumber" });
            process.getOutputStream().close();
            in = process.getInputStream();
            Scanner sc = new Scanner(process.getInputStream());
            String property = sc.next();
            String serial = sc.next();         
            return serial;
        } catch (IOException ex) {
            Logger.getLogger(ComputerID.class.getName()).log(Level.SEVERE, null, ex);
        }finally{
               
            try {
            if(in!=null)                    
                in.close();
            } catch (IOException ex) {
                Logger.getLogger(ComputerID.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        
        return "";
    }
    
    private static  String getUUID(){
        InputStream in = null;
        try {
            Process process = Runtime.getRuntime().exec(new String[] { "wmic", "csproduct", "get", "UUID" });
            process.getOutputStream().close();
            in = process.getInputStream();
            Scanner sc = new Scanner(process.getInputStream());
            String property = sc.next();
            String serial = sc.next();         
            return serial;
        } catch (IOException ex) {
            Logger.getLogger(ComputerID.class.getName()).log(Level.SEVERE, null, ex);
        }finally{
               
            try {
            if(in!=null)                    
                in.close();
            } catch (IOException ex) {
                Logger.getLogger(ComputerID.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        
        return "";
    }
    
    private static  String getDiskSerialNumber(){
        InputStream in = null;
        try {
            Process process = Runtime.getRuntime().exec(new String[] { "wmic", "DISKDRIVE", "get", "SerialNumber" });
            process.getOutputStream().close();
            in = process.getInputStream();
            Scanner sc = new Scanner(process.getInputStream());
            String property = sc.next();
            String serial = sc.next();         
            return serial;
        } catch (IOException ex) {
            Logger.getLogger(ComputerID.class.getName()).log(Level.SEVERE, null, ex);
        }finally{
               
            try {
            if(in!=null)                    
                in.close();
            } catch (IOException ex) {
                Logger.getLogger(ComputerID.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        
        return "";
    }
    
    private static final String LinuxOsSerialNumber() {
                String sn = null;
		if (sn == null) {
			readDmidecode(sn);
		}
		if (sn == null) {
			readLshal(sn);
		}
		if (sn == null) {
			throw new RuntimeException("Cannot find computer SN");
		}

		return sn;
	}

	private static BufferedReader read(String command) {

		OutputStream os = null;
		InputStream is = null;

		Runtime runtime = Runtime.getRuntime();
		Process process = null;
		try {
			process = runtime.exec(command.split(" "));
		} catch (IOException e) {
			throw new RuntimeException(e);
		}

		os = process.getOutputStream();
		is = process.getInputStream();

		try {
			os.close();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}

		return new BufferedReader(new InputStreamReader(is));
	}

	private static void readDmidecode(String sn) {

		String line = null;
		String marker = "Serial Number:";
		BufferedReader br = null;

		try {
			br = read("dmidecode -t system");
			while ((line = br.readLine()) != null) {
				if (line.indexOf(marker) != -1) {
					sn = line.split(marker)[1].trim();
					break;
				}
			}
		} catch (IOException e) {
			throw new RuntimeException(e);
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					throw new RuntimeException(e);
				}
			}
		}
	}

	private static void readLshal(String sn) {

		String line = null;
		String marker = "system.hardware.serial =";
		BufferedReader br = null;

		try {
			br = read("lshal");
			while ((line = br.readLine()) != null) {
				if (line.indexOf(marker) != -1) {
					sn = line.split(marker)[1].replaceAll("\\(string\\)|(\\')", "").trim();
					break;
				}
			}
		} catch (IOException e) {
			throw new RuntimeException(e);
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					throw new RuntimeException(e);
				}
			}
		}
	}    
}
