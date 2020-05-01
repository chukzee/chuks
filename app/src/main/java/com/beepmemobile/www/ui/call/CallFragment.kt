package com.beepmemobile.www.ui.call

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

import com.beepmemobile.www.data.Call
import com.beepmemobile.www.data.User
import com.beepmemobile.www.databinding.CallFragmentBinding
import com.beepmemobile.www.databinding.CallListItemBinding
import com.beepmemobile.www.ui.binding.CallListAdapter

class CallFragment : Fragment() {

    private val model: CallListViewModel by viewModels()
    private var callListAdapter: CallListAdapter? =null

    private var _binding: CallFragmentBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = CallFragment()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        _binding = CallFragmentBinding.inflate(inflater, container, false)
        val view = binding.root

        // bind RecyclerView
        var recyclerView: RecyclerView = binding.callRecyclerView
        recyclerView.setLayoutManager(LinearLayoutManager(this.context));
        callListAdapter = CallListAdapter()
        recyclerView.adapter = callListAdapter

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
        val observer = Observer<MutableList<Call>> { call_list ->
            callListAdapter?.setCallList(app_user, call_list)
        }

        // Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        model.getList().observe(viewLifecycleOwner, observer)

    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
