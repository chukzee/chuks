/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package manager.util;

/**
 *
 * @author ADMIN
 * @param <T>
 */
public class SQLColumn <T>{
    private String name;
    private T value;
    
    private SQLColumn(){
        
    }
    
    public SQLColumn(String column_name, T colum_value){
        name = column_name;
        value = colum_value;
    }
    
    public String getName(){
        return name;
    }
    
     
    public T getValue(){
        return value;
    }   
}
