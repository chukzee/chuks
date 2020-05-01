package com.beepmemobile.www.ui.sms

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.MainActivity
import com.beepmemobile.www.data.msg.SmsMessage
import com.beepmemobile.www.databinding.SmsViewFragmentBinding
import com.beepmemobile.www.ui.binding.SmsViewAdapter

class SmsViewFragment : Fragment() {
    private val model: SmsViewViewModel by viewModels()

    private var _binding: SmsViewFragmentBinding? = null
    private var smsViewAdapter: SmsViewAdapter? =null

    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = SmsViewFragment()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        _binding = SmsViewFragmentBinding.inflate(inflater, container, false)
        val view = binding.root

        // bind RecyclerView
        var recyclerView: RecyclerView = binding.smsRecyclerView
        recyclerView.setLayoutManager(LinearLayoutManager(this.context));
        smsViewAdapter = SmsViewAdapter()
        recyclerView.adapter = smsViewAdapter

        createObserversAndGetData()

        return view
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun createObserversAndGetData(){
        var main_act : MainActivity = this.activity as MainActivity
        var app_user = main_act.app_user
        // Create the observer which updates the UI.
        val observer = Observer<MutableList<SmsMessage>> { sms_list ->
            smsViewAdapter?.setSmsViewList(app_user, sms_list)
        }

        // Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        model.getList().observe(viewLifecycleOwner, observer)

    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
