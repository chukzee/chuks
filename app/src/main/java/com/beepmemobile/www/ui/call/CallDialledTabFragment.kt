package com.beepmemobile.www.ui.call

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.MainActivity

import com.beepmemobile.www.data.Call
import com.beepmemobile.www.databinding.CallDialledTabFragmentBinding
import com.beepmemobile.www.ui.binding.CallListAdapter
import com.beepmemobile.www.ui.main.MainViewModel

class CallDialledTabFragment : Fragment() {

    private val callListAdapter: CallListAdapter by lazy { CallListAdapter(Call.DIALLED_CALL) }
    private val model: CallListViewModel by viewModels()
    private val authModel: MainViewModel by activityViewModels()

    private var _binding: CallDialledTabFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {

        @JvmStatic
        fun newInstance(): CallDialledTabFragment {
            return CallDialledTabFragment()
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        _binding = CallDialledTabFragmentBinding.inflate(inflater, container, false)
        val view = binding.root

        // bind RecyclerView
        var recyclerView: RecyclerView = binding.callDialledTabRecylerView
        recyclerView.layoutManager = LinearLayoutManager(this.context);
        recyclerView.adapter = callListAdapter

        createObserversAndGetData()

        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        createObserversAndGetData()
        super.onViewCreated(view, savedInstanceState)
    }

    private fun createObserversAndGetData(){
        var app_user = authModel.app_user
        // Create the observer which updates the UI.
        val observer = Observer<MutableList<Call>> { calls ->
            if (app_user != null) {
                callListAdapter.setCallList(app_user, calls)
            }
        }

        // Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        model.getList().observe(viewLifecycleOwner, observer)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
