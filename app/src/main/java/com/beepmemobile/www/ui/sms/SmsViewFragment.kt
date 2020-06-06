package com.beepmemobile.www.ui.sms

import android.os.Bundle
import android.view.*
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupWithNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.MainActivity
import com.beepmemobile.www.R
import com.beepmemobile.www.data.Message
import com.beepmemobile.www.data.User
import com.beepmemobile.www.data.msg.SmsMessage
import com.beepmemobile.www.databinding.SmsViewFragmentBinding
import com.beepmemobile.www.ui.binding.SmsViewAdapter
import com.beepmemobile.www.ui.main.MainViewModel
import com.beepmemobile.www.util.Constant

class SmsViewFragment : Fragment() {
    private val model: SmsViewViewModel by viewModels()
    private val authModel: MainViewModel by activityViewModels()
    private val navController by lazy { findNavController() }
    private var _binding: SmsViewFragmentBinding? = null
    private var smsViewAdapter: SmsViewAdapter? =null

    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = SmsViewFragment()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setHasOptionsMenu(true)
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

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {

        super.onViewCreated(view, savedInstanceState)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun createObserversAndGetData(){
        var app_user = authModel.app_user
        // Create the observer which updates the UI.
        val observer = Observer<MutableList<SmsMessage>> { sms_list ->
            if (app_user != null) {
                var other_user_phone_no = arguments?.getString(Constant.OTHER_USER_PHONE_NO)
                smsViewAdapter?.setSmsViewList(app_user, other_user_phone_no,sms_list)
            }
        }

        // Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        model.getList().observe(viewLifecycleOwner, observer)

    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {

        menu.clear() // clear the initial ones, otherwise they are included

        // Inflate the menu; this adds items to the action bar if it is present.
        inflater.inflate(R.menu.sms_app_bar, menu)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
