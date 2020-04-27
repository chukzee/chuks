package com.beepmemobile.www.ui.sms

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup

import com.beepmemobile.www.R

class SmsSendMessageFragment : Fragment() {

    companion object {
        fun newInstance() = SmsSendMessageFragment()
    }

    private lateinit var viewModel: SmsSendMessageViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.sms_send_message_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(SmsSendMessageViewModel::class.java)
        // TODO: Use the ViewModel
    }

}
