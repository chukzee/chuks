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
import com.beepmemobile.www.databinding.SmsListViewFragmentBinding
import com.beepmemobile.www.ui.binding.SmsListViewAdapter

class SmsListViewFragment : Fragment() {
    private val model: SmsListViewModel by viewModels()
    private var smsListViewAdapter: SmsListViewAdapter? =null

    private var _binding: SmsListViewFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = SmsListViewFragment()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = SmsListViewFragmentBinding.inflate(inflater, container, false)
        val view = binding.root

        // bind RecyclerView
        var recyclerView: RecyclerView = binding.smsListRecyclerView
        recyclerView.setLayoutManager(LinearLayoutManager(this.context));
        smsListViewAdapter = SmsListViewAdapter()
        recyclerView.adapter = smsListViewAdapter

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
            smsListViewAdapter?.setSmsListViewList(app_user, sms_list)
        }

        // Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        model.getList().observe(viewLifecycleOwner, observer)

    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
