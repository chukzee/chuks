package excel;

import exception.CSVException;
import java.io.*;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;


public class ExcelUtil {

    public static String convertXlsxToCSV(InputStream input_stream) throws IOException 
    {
        // For storing data into CSV files
        StringBuffer cellValue = new StringBuffer();
        cellValue.append("\"");

        // Get the workbook instance for XLS file
        XSSFWorkbook workbook = new XSSFWorkbook(input_stream);
        
        // Get first sheet from the workbook
        XSSFSheet sheet = workbook.getSheetAt(0);
        Cell cell;
        Row row;

        int rowStart = sheet.getFirstRowNum();
        int rowEnd = sheet.getLastRowNum();

        for (int rowNum = rowStart; rowNum < rowEnd; rowNum++) {
           Row r = sheet.getRow(rowNum);

           int lastColumn = r.getLastCellNum();

           for (int cn = 0; cn < lastColumn; cn++) {
                
               cell = r.getCell(cn, Row.RETURN_NULL_AND_BLANK);
                if(cell!=null){
                switch (cell.getCellType()) 
                {

                    case Cell.CELL_TYPE_BOOLEAN:
                            cellValue.append(cell.getBooleanCellValue()).append("\",\"");
                            break;

                    case Cell.CELL_TYPE_NUMERIC:
                            cellValue.append(cell.getNumericCellValue()).append("\",\"");
                            break;

                    case Cell.CELL_TYPE_STRING:
                            cellValue.append(cell.getStringCellValue().replaceAll("\"", "\"\"")).append("\",\"");
                            break;

                    case Cell.CELL_TYPE_BLANK:
                            cellValue.append("" + "\",\"");
                            break;
                    case Cell.CELL_TYPE_ERROR:
                            cellValue.append("" + "\",\"");
                            break;
                    case Cell.CELL_TYPE_FORMULA:
                            cellValue.append("" + "\",\"");
                            break;
                    default:
                            cellValue.append(cell.toString().replaceAll("\"", "\"\"")).append("\",\"");

                }
                }else{
                    cellValue.append("\",\"");
                }
              
           }
           
            if(cellValue.lastIndexOf(",\"")==cellValue.length()-2){
                cellValue.delete(cellValue.length()-2, cellValue.length());
                cellValue.append("\n\"");
            }           
           
        }
        
        if(cellValue.lastIndexOf("\n\"")==cellValue.length()-2){
            cellValue.delete(cellValue.length()-2, cellValue.length());
        }  
        
        return cellValue.toString();    
    }

    public static String convertXlsToCSV(InputStream input_stream) throws IOException 
    {
        // For storing data into CSV files
        StringBuffer cellValue = new StringBuffer();
        cellValue.append("\"");

        // Get the workbook instance for XLS file
        HSSFWorkbook workbook = new HSSFWorkbook(input_stream);
        // Get first sheet from the workbook
        HSSFSheet sheet = workbook.getSheetAt(0);
        Cell cell;
        Row row;

        int rowStart = sheet.getFirstRowNum();
        int rowEnd = sheet.getLastRowNum();

        for (int rowNum = rowStart; rowNum < rowEnd; rowNum++) {
           Row r = sheet.getRow(rowNum);

           int lastColumn = r.getLastCellNum();

           for (int cn = 0; cn < lastColumn; cn++) {
                
               cell = r.getCell(cn, Row.RETURN_NULL_AND_BLANK);
                if(cell!=null){
                switch (cell.getCellType()) 
                {

                    case Cell.CELL_TYPE_BOOLEAN:
                            cellValue.append(cell.getBooleanCellValue()).append("\",\"");
                            break;

                    case Cell.CELL_TYPE_NUMERIC:
                            cellValue.append(cell.getNumericCellValue()).append("\",\"");
                            break;

                    case Cell.CELL_TYPE_STRING:
                            cellValue.append(cell.getStringCellValue().replaceAll("\"", "\"\"")).append("\",\"");
                            break;

                    case Cell.CELL_TYPE_BLANK:
                            cellValue.append("" + "\",\"");
                            break;
                    case Cell.CELL_TYPE_ERROR:
                            cellValue.append("" + "\",\"");
                            break;
                    case Cell.CELL_TYPE_FORMULA:
                            cellValue.append("" + "\",\"");
                            break;
                    default:
                            cellValue.append(cell.toString().replaceAll("\"", "\"\"")).append("\",\"");

                }
                }else{
                    cellValue.append("\",\"");
                }
              
           }
           
            if(cellValue.lastIndexOf(",\"")==cellValue.length()-2){
                cellValue.delete(cellValue.length()-2, cellValue.length());
                cellValue.append("\n\"");
            }           
           
        }
        
        if(cellValue.lastIndexOf("\n\"")==cellValue.length()-2){
            cellValue.delete(cellValue.length()-2, cellValue.length());
        }  
        
        return cellValue.toString();    
    }
    
    public static String[][] getCSVTable(String content) throws Exception{
        
        try{
            
            content = content.charAt(content.length()-1) != '\n' ? //important for shorter code
                            content+"\n":
                            content;
            
            char[] content_arr = content.toCharArray();
            boolean end_of_quote = true;
            
            int row_index= -1;
            int cell_index= -1;
            int capacity = 10;//REMIND :CHANGE TO 10 LATER
            int cells_available = capacity;
            int row_available = capacity;
            String[][] rows = new String[capacity][];
            String[] cells = new String[capacity];
            String field = "";  
            int field_start_index = 0;
            
            for(int i=0; i<content_arr.length; i++){
                char ch = content_arr[i];


                if(ch=='"'){
                    end_of_quote= !end_of_quote;
                    continue;
                }
                
                if(!end_of_quote)
                    continue;
                
                if(ch==','){
                    char[] f_ch = new char[i - field_start_index];
                    System.arraycopy(content_arr, field_start_index, f_ch, 0, f_ch.length); 
                    field = removeCSVQuote(f_ch);
                    cell_index ++;
                    if(cells_available>0){
                        cells[cell_index]=field;
                        cells_available--;
                    }else{
                        //REMIND: TEST HERE FOR LOGICAL CORRECTNESS
                        String[] col_new = new String[cells.length + capacity];
                        System.arraycopy(cells, 0, col_new, 0, cells.length);
                        col_new[cell_index]=field;
                        cells = col_new;
                        cells_available = capacity - 1;
                    }
                    
                    field_start_index = i + 1;
                    continue;
                }
                
                if(ch=='\n'){
                    
                    char[] f_ch = new char[i - field_start_index];
                    System.arraycopy(content_arr, field_start_index, f_ch, 0, f_ch.length); 
                    field = removeCSVQuote(f_ch);
                    cell_index ++;
                    if(cells_available>0){
                        cells[cell_index]=field;
                        cells_available--;
                    }else{
                        //REMIND: TEST HERE FOR LOGICAL CORRECTNESS
                        String[] cells_new = new String[cells.length + capacity];
                        System.arraycopy(cells, 0, cells_new, 0, cells.length);
                        cells_new[cell_index]=field;
                        cells = cells_new;
                        cells_available = capacity - 1;
                    }
                    
                    field_start_index = i + 1;                    
                    
                    end_of_quote = true;
                    String[] col_new = new String[cells.length - cells_available];
                    System.arraycopy(cells, 0, col_new, 0, col_new.length);
                    cells = col_new;   
                    
                    row_index++;                                        
                    if(row_available>0){
                        rows[row_index]=cells;
                        row_available--;
                    }else{
                        //REMIND: TEST HERE FOR LOGICAL CORRECTNESS
                        String[][] row_new = new String[rows.length + capacity][];
                        System.arraycopy(rows, 0, row_new, 0, rows.length);
                        row_new[row_index]=cells;
                        rows = row_new;
                        row_available = capacity - 1;
                    }                    
                      
                    cell_index = -1;
                    cells_available = capacity;
                    cells = new String[capacity];                    
                }
                
            }//end of for loop


            String[][] rows_new = new String[rows.length - row_available][];
            System.arraycopy(rows, 0, rows_new, 0, rows_new.length);            
            
            if(!end_of_quote){
                throw new CSVException("Invalid csv file - expecting \"");//important
            }
             
            return rows_new;
            
        }catch(Exception e){
            throw new CSVException("Invalid csv file");//important          
        }
        
    }
    
    private static String removeCSVQuote(char[] field){
        char[] required = new char[field.length];
        int last_index = field.length - 1;
        int index=-1;
        boolean last_skip_is_quote =false;
        for(int i = 0; i<field.length; i++){
            if(i==0){
                if(field[0]=='"'){
                    continue;//skip csv openning quote
                }
            }
                                   
            if(i==last_index){
                if(field[last_index]=='"'){
                    continue;//skip csv closing quote
                }
            }
            
            if(i < last_index){
                if(field[i]=='"' && field[i+1]=='"' && !last_skip_is_quote){
                    last_skip_is_quote = true;
                    continue;//skip csv escape quote character
                }
            }
            
            index++;
            required[index] = field[i];
            last_skip_is_quote = false;
        }
        
        field = new char[index+1];
        for(int i=index; i>-1; i--){
            field[i]=required[i];
        }
        
        return new String(field);
    }

    public static void main(String[] args) throws FileNotFoundException, IOException 
    {
            File inputFile = new File("C:\\test\\LFC TESTING GOOD-1.xls");
            File inputFile2 = new File("C:\\test\\input.xlsx");

            System.out.println(convertXlsToCSV(new FileInputStream(inputFile)));
            System.out.println("-----------");
            //System.out.println(convertXlsxToCSV(new FileInputStream(inputFile2)));
    }
}