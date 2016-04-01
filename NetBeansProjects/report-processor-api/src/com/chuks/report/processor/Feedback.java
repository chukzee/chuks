/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import java.awt.Component;
import javax.swing.Icon;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface Feedback {

    Enum SUCCESS = Option.SUCCESS;
    Enum INFO = Option.INFO;
    Enum WARNING = Option.WARNING;
    Enum ERROR = Option.ERROR;

    /**
     * <br/>This method uses an internal {@link javax.swing.JOptionPane} to
     * display an {@link com.chuks.report.processor.Feedback.INFO} alert
     * message.
     *
     * @param message the message to display
     * @param title the title of the message
     */
    void alert(String message, String title);

    /**
     * <br/>This method uses an internal {@link javax.swing.JOptionPane} to
     * display an alert message base on the type specified.
     *
     * @param message the message to display
     * @param title the title of the message
     * @param type type of the message to display
     */
    void alert(String message, String title, Option type);

    /**
     * <br/>This method uses an internal {@link javax.swing.JOptionPane} to
     * display an alert message base on the type specified.
     *
     * @param message the message to display
     * @param title the title of the message
     * @param type type of the message to display
     * @param icon custom icon to display
     */
    void alert(String message, String title, Option type, Icon icon);

    /**
     * This method takes a {@link java.awt.Component} object which the
     * internal {@link javax.swing.JOptionPane} uses as the parent component
     * (Frame) to display an {@link com.chuks.report.processor.Feedback.INFO}
     * alert message.
     *
     * @param container
     * @param message the message to display
     * @param title the title of the message
     */
    void alert(Component container, String message, String title);

    /**
     * This method takes a {@link java.awt.Component} object which the
     * internal {@link javax.swing.JOptionPane} uses as the parent component
     * (Frame) to display an alert message base on the type specified.
     *
     * @param container
     * @param message the message to display
     * @param title the title of the message
     * @param type type of the message to display
     */
    void alert(Component container, String message, String title, Option type);

    /**
     * This method takes a {@link java.awt.Component} object which the
     * internal {@link javax.swing.JOptionPane} uses as the parent component
     * (Frame) to display an alert message base on the type specified.
     *
     * @param container
     * @param message the message to display
     * @param title the title of the message
     * @param type type of the message to display
     * @param icon custom icon to display
     */
    void alert(Component container, String message, String title, Option type, Icon icon);

    
    /**
     * <br/>This method uses an internal {@link javax.swing.JOptionPane} to
     * display a {@link com.chuks.report.processor.Feedback.INFO} confirmation
     * message.
     *
     * @param message the message to display
     * @param title the title of the message
     * @param opt_type the type of option e.g Option.YES_NO, Option.YES_NO_CANCEL , Option.OK, Option.OK_CANCEL
     * @return the option chosen e.g Option.YES, Option.NO, Option.OK, Option.CANCEL 
     */
    Option comfirm(String message, String title, Option opt_type);

    /**
     * <br/>This method uses an internal {@link javax.swing.JOptionPane} to
     * display a confirmation message base on the type specified.
     *
     * @param message the message to display
     * @param title the title of the message
     * @param msg_type the type of message e.g Option.INFO, Option.ERROR, Option.WARNING
     * @param opt_type the type of option e.g Option.YES_NO, Option.YES_NO_CANCEL , Option.OK, Option.OK_CANCEL
     * @return the option chosen e.g Option.YES, Option.NO, Option.OK, Option.CANCEL 
     */
    Option comfirm(String message, String title, Option opt_type, Option msg_type);

    /**
     * <br/>This method uses an internal {@link javax.swing.JOptionPane} to
     * display a confirmation message base on the type specified.
     *
     * @param message the message to display
     * @param title the title of the message
     * @param msg_type the type of message e.g Option.INFO, Option.ERROR, Option.WARNING
     * @param icon custom icon to display
     * @param opt_type the type of option e.g Option.YES_NO, Option.YES_NO_CANCEL , Option.OK, Option.OK_CANCEL
     * @return the option chosen e.g Option.YES, Option.NO, Option.OK, Option.CANCEL
     */
    Option comfirm(String message, String title, Option opt_type, Option msg_type, Icon icon);

    /**
     * This method takes a {@link java.awt.Component} object which the
     * internal {@link javax.swing.JOptionPane} uses as the parent component
     * (Frame) to display a {@link com.chuks.report.processor.Feedback.INFO}
     * confirmation message.
     *
     * @param container
     * @param message the message to display
     * @param title the title of the message
     * @param opt_type the type of option e.g Option.YES_NO, Option.YES_NO_CANCEL , Option.OK, Option.OK_CANCEL
     * @return the option chosen e.g Option.YES, Option.NO, Option.OK, Option.CANCEL
     */
    Option comfirm(Component container, String message, String title, Option opt_type);

    /**
     * This method takes a {@link java.awt.Component} object which the
     * internal {@link javax.swing.JOptionPane} uses as the parent component
     * (Frame) to display a confirmation message base on the type specified.
     *
     * @param container
     * @param message the message to display
     * @param title the title of the message
     * @param msg_type the type of message e.g Option.INFO, Option.ERROR, Option.WARNING
     * @param opt_type the type of option e.g Option.YES_NO, Option.YES_NO_CANCEL , Option.OK, Option.OK_CANCEL
     * @return the option chosen e.g Option.YES, Option.NO, Option.OK, Option.CANCEL 
     */
    Option comfirm(Component container, String message, String title, Option opt_type, Option msg_type);

    /**
     * This method takes a {@link java.awt.Component} object which the
     * internal {@link javax.swing.JOptionPane} uses as the parent component
     * (Frame) to display a confirmation message base on the type specified.
     *
     * @param container
     * @param message the message to display
     * @param title the title of the message
     * @param msg_type the type of message e.g Option.INFO, Option.ERROR, Option.WARNING
     * @param icon custom icon to display
     * @param opt_type the type of option e.g Option.YES_NO, Option.YES_NO_CANCEL , Option.OK, Option.OK_CANCEL 
     * @return the option chosen e.g Option.YES, Option.NO, Option.OK, Option.CANCEL 
     */
    Option comfirm(Component container, String message, String title, Option opt_type, Option msg_type,  Icon icon);
}
