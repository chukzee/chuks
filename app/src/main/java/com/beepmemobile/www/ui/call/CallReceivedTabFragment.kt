package com.beepmemobile.www.ui.call

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

import com.beepmemobile.www.R
import com.beepmemobile.www.data.Call
import com.beepmemobile.www.databinding.CallReceivedTabFragmentBinding
import com.beepmemobile.www.ui.binding.CallListAdapter

class CallReceivedTabFragment(_callListAdapter: CallListAdapter) : Fragment() {

    private var callListAdapter = _callListAdapter
    private var _binding: CallReceivedTabFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        _binding = CallReceivedTabFragmentBinding.inflate(inflater, container, false)
        val view = binding.root

        // bind RecyclerView
        var recyclerView: RecyclerView = binding.callReceivedTabRecylerView
        recyclerView.setLayoutManager(LinearLayoutManager(this.context));
        recyclerView.adapter = callListAdapter

        return view
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
