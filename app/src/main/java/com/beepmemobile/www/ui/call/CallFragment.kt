package com.beepmemobile.www.ui.call

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer

import com.beepmemobile.www.data.Call
import com.beepmemobile.www.databinding.CallFragmentBinding
import com.beepmemobile.www.databinding.CallListItemBinding

class CallFragment : Fragment() {

    private val model: CallListViewModel by viewModels()

    private var _binding: CallFragmentBinding? = null
    private var _call_item_binding: CallListItemBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    private val call_item_binding get() = _call_item_binding!!;

    companion object {
        fun newInstance() = CallFragment()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        // Create the observer which updates the UI.
        val callObserver = Observer<List<Call>> { call ->
            // Update the UI, in this case, a TextView.
            //nameTextView.text = call
        }

        // Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        model.getList().observe(viewLifecycleOwner, callObserver)


        _binding = CallFragmentBinding.inflate(inflater, container, false)
        val view = binding.root

        return view
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
